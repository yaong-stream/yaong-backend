import {
  ConfigModule,
} from '@nestjs/config';

const env = () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  isProduction: process.env.NODE_ENV === 'production',
  enableSwagger: process.env.ENABLE_SWAGGER === 'true' || process.env.SMTP_SECURE === 'enable',
  authSecret: process.env.AUTH_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  domain: process.env.DOMAIN || 'http://localhost:4000',
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
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === 'enable',
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  mistServer: {
    url: process.env.MIST_SERVER_HOST,
    username: process.env.MIST_SERVER_USERNAME,
    password: process.env.MIST_SERVER_PASSWORD,
  },
  aws: {
    region: process.env.AWS_REGION || 'ap-northeast-2',
    bucket: process.env.AWS_BUCKET,
    cdnUrl: process.env.AWS_CDN_URL,
  },
});

export const Configure = ConfigModule.forRoot({
  isGlobal: true,
  load: [
    env,
  ],
});
