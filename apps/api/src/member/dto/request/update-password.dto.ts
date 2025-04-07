import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {

  @ApiProperty({
    description: '이전 비밀번호',
    example: 'p@sswOrd123!',
    type: String,
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
    format: 'password',
  })
  @MinLength(8, { message: 'PreviousPassword must be at least 8 characters long.' })
  @IsString({ message: 'PreviousPassword must be a string.' })
  @IsNotEmpty({ message: 'PreviousPassword is required.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'PreviousPassword must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  previousPassword: string;

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
}
