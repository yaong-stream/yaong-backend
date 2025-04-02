import Redis, {
  RedisOptions,
} from 'ioredis';
import {
  DynamicModule,
  Module,
} from '@nestjs/common';
import {
  RedisService,
} from './redis.service';
import {
  REDIS_CLIENT,
  REDIS_MODULE,
} from './redis.constants';

export type RedisModuleAsyncOptions = {
  imports?: any[],
  inject?: any[],
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions,
};

@Module({
  providers: [
    RedisService,
  ],
  exports: [
    RedisService,
    REDIS_CLIENT,
  ]
})
export class RedisModule {
  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: RedisModule,
      imports: options.imports || [],
      providers: [
        {
          inject: options.inject || [],
          provide: REDIS_MODULE,
          useFactory: options.useFactory,
        },
        {
          inject: [
            REDIS_MODULE,
          ],
          provide: REDIS_CLIENT,
          useFactory: async (redisOptions: RedisOptions) => {
            const client = new Redis(redisOptions);
            return client;
          },
        },
        RedisService,
      ],
      exports: [
        REDIS_CLIENT,
        RedisService,
      ],
    };
  }
}
