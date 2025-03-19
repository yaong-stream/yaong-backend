import {
  DynamicModule,
  Module,
} from "@nestjs/common";
import {
  createClient,
  RedisClientOptions,
} from "redis";
import {
  RedisService,
} from "./redis.service";
import {
  REDIS_CLIENT,
  REDIS_MODULE,
  RedisClient,
} from "./redis.interface";

export type RedisModuleAsyncOptions = {
  imports?: any[],
  inject?: any[],
  useFactory: (...args: any[]) => Promise<RedisClientOptions> | RedisClientOptions,
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
          useFactory: async (redisOptions: RedisClientOptions) => {
            const client: RedisClient = await createClient(redisOptions)
              .on('error', (err) => {
                throw err;
              })
              .connect();
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
