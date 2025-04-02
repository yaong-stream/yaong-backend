import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type {
  Request,
} from 'express';
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
  ActiveSessionsDto,
} from './dto/response';
import {
  MemberGuard,
  DeviceId,
  MemberAuth,
} from './auth.guard';
import {
  AuthLocalSignupGuard,
} from './auth.local-signin-guard';

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
    return {
      success: isValidCode,
    };
  }

  @ApiOperation({
    summary: '로그인 (token)',
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
    @Req() req: Request,
  ) {
    const member = await this.memberService.getMemberCredentialByEmail(body.email);
    if (member == null) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    if (!member.isEmailVerified) {
      throw new UnauthorizedException('Email not verified.');
    }
    const isPasswordValid = await this.argonService.verifyPassword(member.credential.password, body.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // 로그인 기록 저장
    const forwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const { deviceId } = await this.authService.createLoginHistory(member, ipAddress, userAgent);

    const accessToken = await this.authService.createAccessToken(member, deviceId);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.createRefreshToken(member, deviceId);
    const refreshTokenExpireDate = this.authService.getExpireDate(refreshToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, refreshToken, refreshTokenExpireDate);
  }

  @ApiOperation({
    summary: '로그인 (session)',
    description: '이메일과 비밀번호를 사용하여 로그인합니다. 인증된 사용자만 로그인이 가능합니다.'
  })
  @ApiBody({
    type: LoginDto,
    description: '로그인 정보',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          example: 'p@sswOrd123!',
        },
      },
    },
  })
  @UseGuards(AuthLocalSignupGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  public signin(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({
    summary: '로그아웃 (session)',
    description: '현재 기기에서 로그아웃합니다.'
  })
  @ApiOkResponse({
    description: '로그아웃 성공 여부',
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
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @Post('signout')
  public signout(
    @Req() req: Request,
  ) {
    return new Promise((resolve, reject) => {
      req.logOut({ keepSessionInfo: false }, (err) => {
        return err ? reject(err) : resolve({ success: true });
      });
    });
  }

  @ApiOperation({
    summary: '액세스 토큰 재발급 (token)',
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
  public async reissueAccessToken(
    @Body() body: RefreshTokenDto,
  ) {
    const payload = this.authService.verifyRefreshToken(body.refreshToken);
    if (payload.sub == null || payload['deviceId'] == null) {
      throw new UnauthorizedException('Invalid token payload.');
    }
    const memberId: number = Number(payload.sub);
    const deviceId: string = payload['deviceId'];
    const loginHistory = await this.authService.validateRefreshTokenInHistory(memberId, deviceId, body.refreshToken);
    if (loginHistory == null) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const member = await this.memberService.getMemberById(memberId);
    if (!member) {
      throw new BadRequestException('Invalid refresh token.');
    }
    const accessToken = await this.authService.createAccessToken(member, deviceId);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, body.refreshToken, this.authService.getExpireDate(body.refreshToken));
  }

  @ApiOperation({
    summary: '리프레시 토큰 재발급 (token)',
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
  public async reissueRefreshTokens(
    @Body() body: RefreshTokenDto,
  ) {
    const payload = this.authService.verifyRefreshToken(body.refreshToken);
    if (payload.sub == null || payload['deviceId'] == null) {
      throw new UnauthorizedException('Invalid token payload.');
    }
    const memberId: number = Number(payload.sub);
    const deviceId: string = payload['deviceId'];
    const loginHistory = await this.authService.validateRefreshTokenInHistory(memberId, deviceId, body.refreshToken);
    if (loginHistory == null) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const member = await this.memberService.getMemberById(memberId);
    if (!member) {
      throw new BadRequestException('Invalid refresh token.');
    }
    const accessToken = await this.authService.createAccessToken(member, deviceId);
    const accessTokenExpireDate = this.authService.getExpireDate(accessToken);
    const refreshToken = this.authService.createRefreshToken(member, deviceId);
    const refreshTokenExpireDate = this.authService.getExpireDate(refreshToken);
    await this.authService.updateRefreshTokenOnHistory(memberId, deviceId, refreshToken);
    return TokenDto.from(accessToken, accessTokenExpireDate, refreshToken, refreshTokenExpireDate);
  }

  @ApiOperation({
    summary: '활성 세션 조회 (token)',
    description: '현재 로그인된 모든 기기의 세션 정보를 조회합니다.'
  })
  @ApiOkResponse({
    type: ActiveSessionsDto,
    description: '활성 세션 목록',
  })
  @ApiBearerAuth()
  @UseGuards(MemberGuard)
  @Get('sessions')
  public async getActiveSessions(
    @MemberAuth() memberId: number,
  ) {
    const sessions = await this.authService.getActiveSessions(memberId);
    return sessions.map((session) => ActiveSessionsDto.from(session));
  }

  @ApiOperation({
    summary: '다른 기기 로그아웃 (token)',
    description: '현재 기기를 제외한 다른 기기에서 로그아웃합니다.'
  })
  @ApiOkResponse({
    description: '로그아웃 성공 여부',
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
  @UseGuards(MemberGuard)
  @Post('logout/other')
  public async logoutOtherDevices(
    @MemberAuth() memberId: number,
    @Query('device_ids', new ParseArrayPipe({ items: String, separator: ',' })) targetDeviceIds: string[],
    @DeviceId() currentDeviceId: string,
  ) {
    const result = await this.authService.logoutOtherDevices(memberId, currentDeviceId, targetDeviceIds);
    return {
      success: (result.affected || 0) > 0,
    };
  }

  @ApiOperation({
    summary: '로그아웃 (token)',
    description: '현재 기기에서 로그아웃합니다.'
  })
  @ApiOkResponse({
    description: '로그아웃 성공 여부',
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
  @UseGuards(MemberGuard)
  @Post('logout')
  public async logout(
    @MemberAuth() memberId: number,
    @DeviceId() deviceId: string,
    @Req() req: Request,
  ) {
    const result = await this.authService.logout(memberId, deviceId);
    return {
      success: (result.affected || 0) > 0,
    };
  }
}
