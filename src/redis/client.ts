import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('connect', () => console.log('Redis Client Has Connected'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

process.on('SIGINT', () => {
  console.log('Redis Client Has Disconnected');
  redisClient.quit();
});

process.on('SIGTERM', () => {
  console.log('Redis Client Has Disconnected');
  redisClient.quit();
});

export { redisClient };
