import {
  ApiProperty,
} from "@nestjs/swagger";

export class TokenDto {

  @ApiProperty({
    description: 'accesstoken',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMj...',
    required: true,
    type: String,
    format: 'jwt',
  })
  accessToken: string;

  @ApiProperty({
    description: 'accesstoken 만료 시간',
    example: '2025-03-21T00:00:00.000Z',
    required: true,
    type: Date,
  })
  accessTokenExpireDate: Date;

  @ApiProperty({
    description: 'accesstoken',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM...',
    required: true,
    type: String,
    format: 'jwt',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'refreshtoken 만료 시간',
    example: '2025-03-21T00:00:00.000Z',
    required: true,
    type: Date,
  })
  refreshTokenExpireDate: Date;

  static from(accessToken: string, accessTokenExpireDate: Date, refreshToken: string, refreshTokenExpireDate: Date) {
    const dto = new TokenDto();
    dto.accessToken = accessToken;
    dto.accessTokenExpireDate = accessTokenExpireDate;
    dto.refreshToken = refreshToken;
    dto.refreshTokenExpireDate = refreshTokenExpireDate;
    return dto;
  }
}
