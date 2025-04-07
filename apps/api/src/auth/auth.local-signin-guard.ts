import {
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import {
  AuthGuard,
} from '@nestjs/passport';

/**
 * passport의 strategy에서 로그인이 성골하면 serializer를 호출합니다.
 */
@Injectable()
export class AuthLocalSignupGuard extends AuthGuard('local') {

  async canActivate(context: ExecutionContext) {
    const activate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate as boolean;
  }
}