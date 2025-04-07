import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PassportStrategy,
} from '@nestjs/passport';
import {
  Strategy,
} from 'passport-local';
import {
  MemberService,
} from '@api/member/member.service';
import {
  ArgonService,
} from '@api/argon/argon.service';
import {
  MemberDto,
} from '@api/member/dto/response';

/**
 * passport에서 사용자 로그인 처리하는 부분입니다.
 */
@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy, 'local') {

  constructor(
    private readonly memberService: MemberService,
    private readonly argonService: ArgonService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const member = await this.memberService.getMemberCredentialByEmail(email);
    if (member == null) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    if (!member.isEmailVerified) {
      throw new UnauthorizedException('Email not verified.');
    }
    const isPasswordValid = await this.argonService.verifyPassword(member.credential.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return MemberDto.from(member.id, member.nickname, member.profileImage);
  }
}
