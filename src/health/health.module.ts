import {
  Module,
} from '@nestjs/common';
import {
  TerminusModule,
} from '@nestjs/terminus';
import {
  HealthController,
} from './health.controller';
import {
  HealthRedisIndicator,
} from './health.redis-indicator';

@Module({
  imports: [
    TerminusModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [
    HealthRedisIndicator,
  ]
})
export class HealthModule { }
