import {
  Inject,
  Injectable,
} from "@nestjs/common";
import {
  REDIS_CLIENT,
  RedisClient,
} from "./redis.interface";

@Injectable()
export class RedisService {

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) { }

  public getClient() {
    return this.redisClient;
  }

  public ping(key: string) {
    return this.redisClient.ping(key);
  }
}
