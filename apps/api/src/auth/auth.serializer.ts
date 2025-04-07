import {
  Injectable,
} from '@nestjs/common';
import {
  PassportSerializer,
} from '@nestjs/passport';
import {
  MemberDto,
} from '@api/member/dto/response';

/**
 * Passport에서 express-session에 저장하고 가져오는 모듈입니다.
 */
@Injectable()
export class AuthSerializer extends PassportSerializer {

  /**
   * session에 저장
   */
  serializeUser(member: MemberDto, done: Function) {
    done(null, member);
  }
  /**
   * session에서 가져오기
   */
  deserializeUser(member: MemberDto, done: Function) {
    done(null, member);
  }
}
