import {
  ApiProperty,
} from '@nestjs/swagger';

export class MemberDto {

  @ApiProperty({
    description: '회원 고유 식별자',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '회원 닉네임',
    example: '홍길동',
    required: true,
    type: String,
    nullable: false,
  })
  nickname: string;

  @ApiProperty({
    description: '회원 프로필 이미지',
    example: 'https://example.com/profile.jpg',
    required: true,
    type: String,
    nullable: false,
  })
  profileImage: string;

  static from(id: number, nickname: string, profileImage: string) {
    const dto = new MemberDto();
    dto.id = id;
    dto.nickname = nickname;
    dto.profileImage = profileImage;
    return dto;
  }
}
