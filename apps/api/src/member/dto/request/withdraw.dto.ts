import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class WithdrawDto {

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'p@sswOrd123!',
    type: String,
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
    format: 'password',
  })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력값입니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  password: string;
} 