import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import type {
  JwtPayload,
} from 'jsonwebtoken';
import {
  RedisService,
} from 'src/redis/redis.service';
import {
  MemberService,
} from 'src/member/member.service';
import {
  ArgonService,
} from 'src/argon/argon.service';
import {
  AuthService,
} from './auth.service';
import {
  LoginDto,
  RefreshTokenDto,
} from './dto/request';
import {
  TokenDto,
} from './dto/response';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly memberService: MemberService,
    private readonly argonService: ArgonService,
  ) { }

  @ApiOperation({
    summary: '이메일 인증 확인',
    description: '이메일로 받은 인증 코드를 확인하여 계정을 인증합니다.'
  })
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    description: '인증할 이메일 주소',
    example: 'user@example.com'
  })
  @ApiQuery({
    name: 'code',
    required: true,
    type: String,
    description: '이메일로 받은 인증 코드',
    example: 'beb1885261eaf40ef95533dc59765...'
  })
  @ApiOkResponse({
    description: '인증 성공 여부',
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
  @Get('verify')
  public async verify(
    @Query('email') email: string,
    @Query('code') code: string,
  ) {
    const decodedEmail = decodeURIComponent(email);
    const decodedCode = decodeURIComponent(code);
    const isValidCode = await this.redisService.get(`yaong-email/${decodedEmail}`) === decodedCode;
    if (isValidCode) {
      this.redisService.del(`yaong-email/${decodedEmail}`);
      await this.memberService.verifyEmail(email);
    } else {
      throw new BadRequestException('Invalid verification code.');
    }
    return { success: true };
  }

  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호를 사용하여 로그인합니다. 인증된 사용자만 로그인이 가능합니다.'
  })
  @ApiBody({
    type: LoginDto,
    description: '로그인 정보',
    required: true,
  })
  @ApiOkResponse({
    type: TokenDto,
    description: '로그인 토큰',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(
    @Body() body: LoginDto,
  ) {
    const member = await this.memberService.getMemberCredentialByEmail(body.email);
    if (member == null) {
      throw new BadRequestException('Invalid email or password.');
    }
    if (!member.isEmailVerified) {
      throw new BadRequestException('Email not verified.');
    }
    const isPasswordValid = await this.argonService.verifyPassword(member.credential.password, body.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }
    const accessToken = await this.authService.createAccessToken(member);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.createRefreshToken(member);
    const refreshTokenExpireDate = this.authService.getExpireDate(refreshToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, refreshToken, refreshTokenExpireDate);
  }

  @ApiOperation({
    summary: '액세스 토큰 재발급',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: '리프레시 토큰 정보',
    required: true,
  })
  @ApiOkResponse({
    type: TokenDto,
    description: '새로운 액세스 토큰',
  })
  @HttpCode(HttpStatus.OK)
  @Post('accesstoken')
  public async refreshAccessToken(
    @Body() body: RefreshTokenDto,
  ) {
    const payload = this.authService.verifyRefreshToken(body.refreshToken);
    if (payload.sub == null) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const member = await this.memberService.getMemberById(Number(payload.sub));
    if (!member) {
      throw new BadRequestException('Invalid refresh token.');
    }
    const accessToken = await this.authService.createAccessToken(member);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, body.refreshToken, this.authService.getExpireDate(body.refreshToken));
  }

  @ApiOperation({
    summary: '리프레시 토큰 재발급',
    description: '기존 리프레시 토큰을 사용하여 새로운 리프레시 토큰을 발급받습니다.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: '리프레시 토큰',
    required: true,
  })
  @ApiOkResponse({
    type: TokenDto,
    description: '새로운 액세스 토큰과 리프레시 토큰',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refreshtoken')
  public async refreshTokens(
    @Body() body: RefreshTokenDto,
  ) {
    const payload = await this.authService.verifyRefreshToken(body.refreshToken) as JwtPayload;
    if (payload.sub == null) {
      throw new BadRequestException('Invalid refresh token.');
    }
    const member = await this.memberService.getMemberById(Number(payload.sub));
    if (!member) {
      throw new BadRequestException('Invalid refresh token.');
    }
    const accessToken = await this.authService.createAccessToken(member);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.createRefreshToken(member);
    const refreshTokenExpireDate = this.authService.getExpireDate(refreshToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, refreshToken, refreshTokenExpireDate);
  }
}
