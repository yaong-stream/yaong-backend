import * as crypto from 'node:crypto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  MailerService,
} from '@api/mailer/mailer.service';
import {
  RedisService,
} from '@api/redis/redis.service';
import {
  MemberGuard,
  MemberAuth,
} from '@api/auth/auth.guard';
import {
  ArgonService,
} from '@api/argon/argon.service';
import {
  MemberService,
} from './member.service';
import {
  SignupDto,
  UpdateMemberDto,
  UpdatePasswordDto,
  WithdrawDto,
} from './dto/request';
import {
  MemberDto,
  MemberInfoDto,
} from './dto/response';
import {
  type Response,
} from 'express';

@Controller()
export class MemberController {

  constructor(
    private readonly argonService: ArgonService,
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
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  public async signup(
    @Body() body: SignupDto,
  ) {
    const hash = await this.argonService.hashPassword(body.password);
    const member = await this.memberService.createMember(body.email, hash, body.nickname);
    const verifyCode = crypto.randomBytes(32).toString('hex');
    this.redisService.setex(`yaong-email/${member.email}`, verifyCode, 3600);
    const verifyLink = `${this.configService.getOrThrow<string>('domain')}/api/v1/auth/verify?email=${encodeURIComponent(member.email)}&code=${encodeURIComponent(verifyCode)}`;
    this.mailerService.sendEmailVerify(member.email, verifyLink);
    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴를 진행합니다. 비밀번호 확인이 필요합니다.'
  })
  @ApiBody({
    type: WithdrawDto,
    description: '회원 탈퇴 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '회원 탈퇴 성공 여부',
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
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post('withdraw')
  public async withdraw(
    @MemberAuth() memberId: number,
    @Body() body: WithdrawDto,
    @Res() res: Response,
  ) {
    const member = await this.memberService.getMemberCredentialById(memberId);
    if (!member) {
      throw new BadRequestException('Invalid member.');
    }
    const isPasswordValid = await this.argonService.verifyPassword(member.credential.password, body.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect.');
    }
    const result = await this.memberService.withdraw(memberId);
    return res
      .clearCookie('session-id')
      .json({
        success: (result.affected || 0) > 0,
      });
  }

  @ApiOperation({
    summary: '회원 정보 조회',
    description: '로그인한 회원 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '회원 정보',
    type: MemberDto,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getMemberInfo(
    @MemberAuth() memberId: number,
  ) {
    const member = await this.memberService.getMemberById(memberId);
    if (member == null) {
      throw new NotFoundException('Member not found.');
    }
    return MemberInfoDto.from(member);
  }

  @ApiOperation({
    summary: '회원 정보 수정',
    description: '회원 정보를 수정합니다.',
  })
  @ApiBody({
    type: UpdateMemberDto,
    description: '회원 정보 수정 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '회원 정보 수정 성공 여부',
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
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch()
  public async updateMemberInfo(
    @MemberAuth() memberId: number,
    @Body() body: UpdateMemberDto,
  ) {
    const result = await this.memberService.updateMember(memberId, body.nickname, body.profileImage);
    return {
      success: (result.affected || 0) > 0,
    };
  }

  @ApiOperation({
    summary: '회원 비밀번호 수정',
    description: '회원 비밀번호를 수정합니다.',
  })
  @ApiBody({
    type: UpdatePasswordDto,
    description: '회원 비밀번호 수정 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '회원 비밀번호 수정 성공 여부',
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
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('password')
  public async updateMemberPassword(
    @MemberAuth() memberId: number,
    @Body() body: UpdatePasswordDto,
  ) {
    const member = await this.memberService.getMemberCredentialById(memberId);
    if (member == null) {
      throw new NotFoundException('Member not found.');
    }
    const isPasswordValid = await this.argonService.verifyPassword(member.credential.password, body.previousPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('PreviousPassword is incorrect.');
    }
    const hash = await this.argonService.hashPassword(body.password);
    const result = await this.memberService.updateMemberPassword(memberId, hash);
    return {
      success: (result.affected || 0) > 0,
    };
  }
}
