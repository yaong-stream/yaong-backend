import {
  Injectable,
} from '@nestjs/common';
import {
  HealthIndicatorService,
} from '@nestjs/terminus';
import {
  RedisService,
} from '@api/redis/redis.service';

@Injectable()
export class HealthRedisIndicator {

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly redisService: RedisService,
  ) { }

  public async pingCheck(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    const result = await this.redisService.ping(key);
    return result === key ? indicator.up() : indicator.down();
  }
}
