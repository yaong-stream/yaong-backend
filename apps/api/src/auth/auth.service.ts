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
  InjectRepository,
} from '@nestjs/typeorm';
import {
  UAParser,
} from 'ua-parser-js';
import {
  v4 as uuidv4,
} from 'uuid';
import {
  Repository,
  Not,
  In,
} from 'typeorm';
import {
  Member,
  LoginHistory,
} from '@api/entities';

@Injectable()
export class AuthService {

  private readonly refreshSecret: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepository: Repository<LoginHistory>,
  ) {
    this.refreshSecret = this.configService.getOrThrow<string>('jwt.refreshSecret');
  }

  public createAccessToken(member: Member, deviceId: string) {
    const payload = {
      sub: member.id,
      nickname: member.nickname,
      profileImage: member.profileImage,
      deviceId,
    };
    const signOptions: JwtSignOptions = {
      expiresIn: '1h',
      issuer: 'yaong-api',
      audience: 'yaong',
    };
    return this.jwtService.signAsync(payload, signOptions);
  }

  public createRefreshToken(member: Member, deviceId: string) {
    const payload = {
      sub: member.id,
      deviceId,
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

  public updateRefreshTokenOnHistory(memberId: number, deviceId: string, refreshToken: string) {
    return this.loginHistoryRepository.update(
      {
        member: {
          id: memberId,
        },
        deviceId
      },
      {
        refreshToken,
      },
    );
  }

  public getActiveSessions(memberId: number) {
    return this.loginHistoryRepository.find({
      where: {
        member: {
          id: memberId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public logoutOtherDevices(memberId: number, currentDeviceId: string, targetDeviceIds?: string[]) {
    if (targetDeviceIds == null) {
      // 모든 기기 로그아웃
      return this.loginHistoryRepository.delete({
        member: {
          id: memberId,
        },
        deviceId: Not(currentDeviceId),
      });
    }
    // 특정 기기 로그아웃
    return this.loginHistoryRepository.delete({
      member: {
        id: memberId,
      },
      deviceId: In(targetDeviceIds),
    });
  }

  public logout(memberId: number, deviceId: string) {
    return this.loginHistoryRepository.delete({
      member: {
        id: memberId,
      },
      deviceId,
    });
  }

  public async createLoginHistory(member: Member, ipAddress: string, userAgent: string) {
    const parser = new UAParser();
    parser.setUA(userAgent);
    const result = parser.getResult();

    const deviceId = uuidv4();
    const refreshToken = this.createRefreshToken(member, deviceId);

    let loginHistory = this.loginHistoryRepository.create({
      member,
      deviceId,
      refreshToken,
      ipAddress,
      userAgent,
      deviceType: result.device.type || 'desktop',
      browserName: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || 'Unknown'
    });

    loginHistory = await this.loginHistoryRepository.save(loginHistory);
    return { deviceId, loginHistory, refreshToken };
  }

  public validateRefreshTokenInHistory(memberId: number, deviceId: string, refreshToken: string) {
    return this.loginHistoryRepository.findOne({
      where: {
        member: {
          id: memberId,
        },
        deviceId,
        refreshToken,
      }
    });
  }
}
