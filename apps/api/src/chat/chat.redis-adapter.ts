import * as passport from 'passport';
import {
  IoAdapter,
} from '@nestjs/platform-socket.io';
import {
  createAdapter,
} from '@socket.io/redis-adapter';
import type Redis from 'ioredis';
import type {
  INestApplicationContext,
} from '@nestjs/common';
import type {
  RequestHandler,
} from 'express';
import type {
  Server,
  ServerOptions,
} from 'socket.io';

export class ChatRedisAdapter extends IoAdapter {

  constructor(
    private readonly app: INestApplicationContext,
    private readonly session: RequestHandler,
  ) {
    super(app);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(redis: Redis) {
    const pub = redis;
    const sub = pub.duplicate();
    this.adapterConstructor = createAdapter(pub, sub);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const io: Server = super.createIOServer(port, options);
    io.adapter(this.adapterConstructor);
    io.engine.use(this.session);
    io.engine.use(passport.initialize());
    io.engine.use(passport.session());
    return io;
  }
}
