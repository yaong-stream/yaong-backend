import {
  ApiProperty,
} from "@nestjs/swagger";

export class TokenDto {

  @ApiProperty({
    description: '액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    description: '액세스 토큰 만료 시간',
    example: '2024-03-20T12:00:00Z',
    type: String,
    required: true,
  })
  accessTokenExpireDate: Date;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
    required: true,
  })
  refreshToken: string;

  @ApiProperty({
    description: '리프레시 토큰 만료 시간',
    example: '2024-04-19T12:00:00Z',
    type: String,
    required: true,
  })
  refreshTokenExpireDate: Date;

  public static from(
    accessToken: string,
    accessTokenExpireDate: Date,
    refreshToken: string,
    refreshTokenExpireDate: Date,
  ): TokenDto {
    const token = new TokenDto();
    token.accessToken = accessToken;
    token.accessTokenExpireDate = accessTokenExpireDate;
    token.refreshToken = refreshToken;
    token.refreshTokenExpireDate = refreshTokenExpireDate;
    return token;
  }
}
