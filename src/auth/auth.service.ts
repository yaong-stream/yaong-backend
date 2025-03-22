import * as jwt from 'jsonwebtoken';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  JwtService,
  JwtSignOptions,
} from '@nestjs/jwt';
import {
  Member,
} from 'src/entities';
import {
  MemberService,
} from 'src/member/member.service';

@Injectable()
export class AuthService {

  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {
    this.refreshSecret = this.configService.getOrThrow<string>('jwt.refreshSecret');
  }

  public createAccessToken(member: Member) {
    const payload = {
      sub: member.id,
      nickname: member.nickname,
    };
    const signOptions: JwtSignOptions = {
      issuer: 'yaong-api',
      audience: 'yaong',
    };
    return this.jwtService.signAsync(payload, signOptions);
  }

  public createRefreshToken(member: Member) {
    const payload = {
      sub: member.id,
    };
    const signOptions: JwtSignOptions = {
      expiresIn: '30d',
      issuer: 'yaong-api',
      audience: 'yaong',
    };
    return jwt.sign(payload, this.refreshSecret, signOptions);
  }

  public verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  public verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret);
  }

  public getExpireDate(token: string) {
    const decoded = this.jwtService.decode(token);
    return new Date(decoded.exp * 1000);
  }
}
