import type Redis from 'ioredis';
import {
  IoAdapter,
} from '@nestjs/platform-socket.io';
import {
  createAdapter,
} from '@socket.io/redis-adapter';
import {
  ServerOptions,
} from 'socket.io';

export class ChatRedisAdapter extends IoAdapter {

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(redis: Redis) {
    const pub = redis;
    const sub = pub.duplicate();
    this.adapterConstructor = createAdapter(pub, sub);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const io = super.createIOServer(port, options);
    io.adapter(this.adapterConstructor);
    return io;
  }
}
