import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as  passport from 'passport';
import * as bodyParser from 'body-parser';
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
  RedisStore,
} from 'connect-redis';
import {
  AppModule,
} from './app.module';
import {
  GlobalExceptionFilter,
} from './exception/global-exception-filter';
import {
  ChatRedisAdapter,
} from './chat/chat.redis-adapter';
import {
  RedisService,
} from './redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ json: true, colors: process.env.NODE_ENV !== 'production' }),
  });
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const isProduction = configService.getOrThrow<boolean>('isProduction');
  const enableSwagger = configService.getOrThrow<boolean>('enableSwagger');
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

  const redisService = app.get(RedisService);
  const redisIOAdapter = new ChatRedisAdapter(app);
  await redisIOAdapter.connectToRedis(redisService.getClient());
  app
    .useWebSocketAdapter(redisIOAdapter);

  const redisStore = new RedisStore({ client: redisService.getClient() });
  app
    .set('query parser', 'extended')
    .set('trust proxy', true);
  app
    .enableShutdownHooks()
    .use(cookieParser())
    .use(helmet())
    .use(bodyParser.text({ type: 'text/plain' }))
    .use(session({
      name: 'session-id',
      store: redisStore,
      resave: false,
      saveUninitialized: false,
      secret: configService.getOrThrow('sessionSecret'),
      rolling: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: isProduction,
        domain: isProduction ? '.narumir.io' : undefined,
        sameSite: 'lax',
      },
    }))
    .use(passport.initialize())
    .use(passport.session())
    .useGlobalPipes(new ValidationPipe(validationOptiions))
    .useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || !isProduction) {
        return callback(null, true);
      }
      if (/^(https?:\/\/)?(([\w\d-\.]*)?\.)?narumir.io/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  if (!isProduction || enableSwagger) {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Yaong')
      .setDescription('Yaong API Document')
      .setVersion(pkg.version)
      .addBearerAuth()
      .addCookieAuth('session-id')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api', app, documentFactory);
  }
  await app.listen(port);
}

bootstrap();
