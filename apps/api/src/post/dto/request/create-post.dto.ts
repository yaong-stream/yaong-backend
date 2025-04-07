import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePostDto {

  @ApiProperty({
    description: '게시글 내용',
    example: '안녕하세요.',
    type: String,
    required: true,
    minLength: 1,
  })
  @IsString({ message: 'Content must be a string.' })
  @MinLength(1, { message: 'Content must be at least 1 character long.' })
  @IsNotEmpty({ message: 'Content is required.' })
  content: string;
}
