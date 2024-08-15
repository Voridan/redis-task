import dotenv from 'dotenv';
import { Client } from 'pg';
import { createClient } from 'redis';
import { deserializeEvent } from './util/event.deserialize';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
});

const pgClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: +(process.env.DB_PORT || 5432),
});

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

pgClient.on('error', (err) => console.log('Postgres Client Error', err));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

type Event = {
  value: string;
  score: number;
};

async function main() {
  const BATCH_SIZE = 10_000;
  const SET_KEY = 'events';
  const TEMP_SET_KEY = 'old_events';
  const getEvents = () =>
    redisClient.zRangeWithScores(TEMP_SET_KEY, 0, BATCH_SIZE);

  await redisClient.connect();
  await pgClient.connect();

  try {
    await redisClient.renameNX(SET_KEY, TEMP_SET_KEY);
    let events = await getEvents();
    while (events.length > 0) {
      await redisClient.zRemRangeByRank(TEMP_SET_KEY, 0, BATCH_SIZE);
      await upsertEvents(events);
      events = await getEvents();
    }
    await redisClient.del(TEMP_SET_KEY);
  } catch (e) {
    console.log(e);
  } finally {
    await redisClient.quit();
    await pgClient.end();
    process.exit(0);
  }
}

main();

async function upsertEvents(events: Event[]) {
  const placeholders = events.map((_, idx) => getPlaceholderStr(6, idx));
  const values = events.reduce(
    (joined, { value, score }) =>
      joined.concat(Object.values({ ...deserializeEvent(value), score })),
    [] as Array<string | number | {}>
  );

  const queryStr = `
  INSERT INTO events_warehouse (
    project_id,
    event_name,
    country_code,
    "timestamp",
    extra_params,
    score
  ) VALUES ${placeholders}
  ON CONFLICT (project_id, event_name, country_code, "timestamp")
  DO UPDATE SET
    extra_params = events_warehouse.extra_params || EXCLUDED.extra_params,
    score = events_warehouse.score + EXCLUDED.score`;

  await pgClient.query(queryStr, values);
}

function getPlaceholderStr(paramsNum: number, entryIdx: number) {
  let placeholderStr = '(';
  for (let i = 1; i <= paramsNum; i++) {
    placeholderStr +=
      `$${entryIdx * paramsNum + i}` + (i === paramsNum ? ')' : ',');
  }

  return placeholderStr;
}
