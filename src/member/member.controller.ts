import * as crypto from 'node:crypto';
import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  MailerService,
} from 'src/mailer/mailer.service';
import {
  RedisService,
} from 'src/redis/redis.service';
import {
  MemberService,
} from './member.service';
import {
  SignupDto,
} from './dto/request';

@Controller()
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { }

  @ApiOperation({
    summary: '회원가입',
    description: '이메일과 비밀번호 그리고 닉네임를 사용하여 회원가입합니다. 이후 이메일 인증이 필요합니다.'
  })
  @ApiBody({
    type: SignupDto,
    description: '회원가입 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '회원가입 성공',
    example: {
      success: true,
    },
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @Post('signup')
  public async signup(
    @Body() body: SignupDto,
  ) {
    const member = await this.memberService.createMember(body.email, body.password, body.nickname);
    const verifyCode = crypto.randomBytes(32).toString('hex');
    this.redisService.setex(`yaong-email/${member.email}`, verifyCode, 3600);
    const verifyLink = `${this.configService.getOrThrow<string>('domain')}/api/v1/auth/verify?email=${encodeURIComponent(member.email)}&code=${encodeURIComponent(verifyCode)}`;
    this.mailerService.sendEmailVerify(member.email, verifyLink);
  }
}
