import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  Member,
} from 'src/entities';

export class MemberInfoDto {

  @ApiProperty({
    type: Number,
    description: '회원 고유 식별자',
    example: 1,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: '회원 닉네임',
    example: 'user',
    nullable: false,
  })
  nickname: string;

  @ApiProperty({
    type: String,
    description: '회원 프로필 이미지',
    example: 'https://example.com/profile.jpg',
    nullable: false,
  })
  profileImage: string;

  @ApiProperty({
    type: String,
    description: '회원 이메일',
    example: 'user@example.com',
    nullable: false,
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    description: '이메일 인증 여부',
    example: true,
    nullable: false,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    type: Date,
    description: '회원 가입일',
    example: '2021-01-01T00:00:00.000Z',
    nullable: false,
  })
  createdAt: Date;

  static from(member: Member) {
    const dto = new MemberInfoDto();
    dto.id = member.id;
    dto.nickname = member.nickname;
    dto.profileImage = member.profileImage;
    dto.email = member.email;
    dto.isEmailVerified = member.isEmailVerified;
    dto.createdAt = member.createdAt;
    return dto;
  }
}
