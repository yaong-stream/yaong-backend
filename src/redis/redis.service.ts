import type Redis from "ioredis";
import {
  Inject,
  Injectable,
} from "@nestjs/common";
import {
  REDIS_CLIENT,
} from "./redis.constants";
import { RedisKey } from "ioredis";

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
}
