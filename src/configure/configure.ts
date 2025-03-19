import {
  ConfigModule,
} from '@nestjs/config';

const env = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});

export const Configure = ConfigModule.forRoot({
  load: [
    env,
  ],
});
