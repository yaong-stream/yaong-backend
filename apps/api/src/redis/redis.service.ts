import type Redis from 'ioredis';
import {
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  REDIS_CLIENT,
} from './redis.constants';
import {
  type RedisKey,
} from 'ioredis';

type RedisValue = string | Buffer | number;

@Injectable()
export class RedisService {

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) { }

  public getClient() {
    return this.redisClient;
  }

  public ping(key: string) {
    return this.redisClient.ping(key);
  }

  public set(key: RedisKey, value: string | Buffer | number,) {
    return this.redisClient.set(key, value)
  }

  public setex(key: RedisKey, value: RedisValue, seconds: number) {
    return this.redisClient.setex(key, seconds, value);
  }

  public get(key: RedisKey) {
    return this.redisClient.get(key);
  }

  public del(...keys: RedisKey[]) {
    return this.redisClient.del(keys);
  }

  public hset(key: RedisKey, obj: object) {
    return this.redisClient.hset(key, obj);
  }

  public hdel(key: RedisKey, ...fields: (string | Buffer)[]) {
    return this.redisClient.hdel(key, ...fields);
  }

  public hget(key: RedisKey, field: string | Buffer) {
    return this.redisClient.hget(key, field);
  }

  public hgetAll(key: RedisKey) {
    return this.redisClient.hgetall(key);
  }

  public expire(key: RedisKey, seconds: number) {
    return this.redisClient.expire(key, seconds);
  }
}
