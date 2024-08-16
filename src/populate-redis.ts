import { faker } from '@faker-js/faker';
import { EventParams } from './interface';

const sendRequest = async (body: EventParams) => {
  return await fetch('http://localhost:5000/track-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

const makeBody = (): EventParams => ({
  project_id: faker.string.alphanumeric(6),
  event_name: faker.word.noun(),
  country_code: faker.location.countryCode({ variant: 'alpha-2' }),
  timestamp: Date.now(),
  [faker.word.noun()]: faker.word.noun(),
  [faker.word.noun()]: faker.number.int(),
});

const run = async () => {
  console.time('requests');
  const promises = [];
  let body = makeBody();
  for (let i = 0; i < 10_000; i++) {
    if (i % 2 !== 0) body = makeBody();
    promises.push(sendRequest(body));
  }

  await Promise.all(promises);
  console.timeEnd('requests');
};

run()
  .catch((err) => {
    console.error('Error:', err);
  })
  .finally(() => process.exit(0));
