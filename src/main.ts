import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import {
  NestFactory,
} from '@nestjs/core';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ConsoleLogger,
} from '@nestjs/common';
import {
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  AppModule,
} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: process.env.NODE_ENV !== "production" }),
  });
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');

  app
    .set("query parser", "extended")
    .set("trust proxy", true);
  app
    .enableShutdownHooks()
    .use(cookieParser())
    .use(helmet());
  await app.listen(port);
}
bootstrap();
