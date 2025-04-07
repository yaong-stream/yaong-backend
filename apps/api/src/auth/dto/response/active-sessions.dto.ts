import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  LoginHistory,
} from '@api/entities';

export class ActiveSessionsDto {

  @ApiProperty({
    description: '기기 ID',
    example: '989bf69a-c807-4511-a778-5b4f409d6dc7',
    type: String,
    required: true,
  })
  deviceId: string;

  @ApiProperty({
    description: 'IP 주소',
    example: '127.0.0.1',
    type: String,
    required: true,
  })
  ipAddress: string;

  @ApiProperty({
    description: '기기 타입',
    example: 'desktop',
    type: String,
    required: true,
  })
  deviceType: string;

  @ApiProperty({
    description: '브라우저 이름',
    example: 'Chrome',
    type: String,
    required: true,
  })
  browserName: string;

  @ApiProperty({
    description: '브라우저 버전',
    example: '1.0.0',
    type: String,
    required: true,
  })
  browserVersion: string;

  @ApiProperty({
    description: '로그인 시간',
    example: '2024-03-20T12:00:00Z',
    type: String,
    required: true,
  })
  loginAt: Date;

  public static from(
    loginHistory: LoginHistory,
  ): ActiveSessionsDto {
    const session = new ActiveSessionsDto();
    session.deviceId = loginHistory.deviceId;
    session.ipAddress = loginHistory.ipAddress;
    session.deviceType = loginHistory.deviceType;
    session.browserName = loginHistory.browserName;
    session.browserVersion = loginHistory.browserVersion;
    session.loginAt = loginHistory.createdAt
    return session;
  }
}
