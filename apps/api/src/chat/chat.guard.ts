import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import {
  JwtService,
} from '@nestjs/jwt';
import {
  WsException,
} from '@nestjs/websockets';
import {
  Socket,
} from 'socket.io';
import type {
  Request,
} from 'express';

@Injectable()
export class ChatGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const authorization = client.handshake.headers.authorization;
    if (authorization == null) {
      const request = client.request as Request;
      return request.isAuthenticated();
    }
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
      throw new WsException('Missing authorization token.');
    }
    try {
      const [, token] = authorization.split(' ');
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload.sub || !payload.deviceId) {
        throw new WsException('Invalid token payload.');
      }
      context.switchToWs().getData()['sub'] = payload.sub;
      return true;
    } catch (e) {
      throw new WsException('Invalid authorization token.');
    }
  }
}
