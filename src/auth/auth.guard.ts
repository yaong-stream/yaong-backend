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
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('bearer ')) {
      throw new UnauthorizedException('Missing authorization token.');
    }
    try {
      const [, token] = authorization.split(' ');
      const payload = await this.jwtService.verifyAsync(token);
      req["sub"] = payload.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Missing authorization token.');
    }
  }
}

export const MemberAuth = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const req = ctx.getRequest<Request>();
  return req["sub"];
});
