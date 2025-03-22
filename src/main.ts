import * as cookieParser from 'cookie-parser';
import * as fs from 'node:fs';
import * as path from 'node:path';
import helmet from 'helmet';
import {
  NestFactory,
} from '@nestjs/core';
import {
  ConfigService,
} from '@nestjs/config';
import {
  BadRequestException,
  ConsoleLogger,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  AppModule,
} from './app.module';
import {
  GlobalExceptionFilter,
} from './exception/global-exceptio-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: process.env.NODE_ENV !== 'production' }),
  });
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const isProduction = configService.getOrThrow<boolean>('isProduction');
  const validationOptiions: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      return new BadRequestException(errors.map((error) => ({
        field: error.property,
        detail: Object.values(error.constraints ?? {})[0],
      })));
    },
  };
  app
    .set('query parser', 'extended')
    .set('trust proxy', true);
  app
    .enableShutdownHooks()
    .use(cookieParser())
    .use(helmet())
    .useGlobalPipes(new ValidationPipe(validationOptiions))
    .useGlobalFilters(new GlobalExceptionFilter());
  if (!isProduction) {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Yaong')
      .setDescription('Yaong API Document')
      .setVersion(pkg.version)
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api', app, documentFactory);
  }
  await app.listen(port);
}
bootstrap();
