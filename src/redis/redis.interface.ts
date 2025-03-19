import {
  createClient,
} from 'redis';

export type RedisClient = ReturnType<typeof createClient>;
export const REDIS_MODULE = 'REDIS_MODULE';
export const REDIS_CLIENT = 'REDIS_CLIENT';
