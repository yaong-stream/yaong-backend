import {
  Controller,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import {
  InjectDataSource,
} from '@nestjs/typeorm';
import {
  DataSource,
} from 'typeorm';
import {
  HealthRedisIndicator,
} from './health.redis-indicator';

@ApiTags('Health check')
@Controller()
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly healthIndicator: TypeOrmHealthIndicator,
    private readonly redisHealthIndicator: HealthRedisIndicator,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  @HealthCheck()
  @Get('/check')
  public async check() {
    return this.healthService.check([
      () => this.healthIndicator.pingCheck('database', { connection: this.dataSource }),
      () => this.redisHealthIndicator.pingCheck('redis'),
    ]);
  }
}
