import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";
import {
  RedisModule,
} from "src/redis/redis.module";

export const Redis = RedisModule.forRootAsync({
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: (configService: ConfigService) => {
    const host = configService.getOrThrow<string>('redis.host');
    const port = configService.getOrThrow<number>('redis.port');
    return {
      url: `redis://${host}:${port}`,
    };
  },
});
