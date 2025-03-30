import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JwtService,
} from '@nestjs/jwt';
import type {
  Request,
} from 'express';

@Injectable()
export class MemberGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authorization = req.headers.authorization;
    if (!authorization?.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing authorization token.');
    }
    try {
      const [, token] = authorization.split(' ');
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload.sub || !payload.deviceId) {
        throw new UnauthorizedException('Invalid token payload.');
      }
      req["sub"] = payload.sub;
      req["deviceId"] = payload.deviceId;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid authorization token.');
    }
  }
}

export const MemberAuth = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const req = ctx.getRequest<Request>();
  return req["sub"];
});

export const DeviceId = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const req = ctx.getRequest<Request>();
  return req["deviceId"];
});
