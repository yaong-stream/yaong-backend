import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateMemberDto {

  @ApiProperty({
    type: String,
    description: '사용자 닉네임',
    example: 'user',
    required: true,
    minLength: 2,
    maxLength: 32,
    pattern: '^[a-zA-Z0-9가-힣]+$',
  })
  @IsString({ message: 'Nickname must be a string' })
  @IsNotEmpty({ message: 'Nickname is required' })
  @Matches(/^[a-zA-Z0-9가-힣]+$/, {
    message: 'Username can only contain letters, numbers, underscores and korean.',
  })
  nickname: string;

  @ApiProperty({
    type: String,
    description: '회원 프로필 이미지',
    example: 'https://example.com/profile.jpg',
    nullable: false,
  })
  @IsString({ message: 'ProfileImage must be a string' })
  @IsNotEmpty({ message: 'ProfileImage is required' })
  profileImage: string;
}
