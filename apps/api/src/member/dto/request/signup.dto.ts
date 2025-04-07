import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {

  @ApiProperty({
    type: String,
    description: '사용자 이메일',
    example: 'user@example.com',
    required: true,
    minLength: 5,
    maxLength: 320,
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'p@sswOrd123!',
    type: String,
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
    format: 'password',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  password: string;

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
}
