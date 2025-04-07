import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePostCommentDto {

  @ApiProperty({
    description: '댓글 내용',
    example: '좋은 게시글 감사합니다.',
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  })
  @IsString({ message: '댓글은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '댓글은 필수 입력값입니다.' })
  @MinLength(1, { message: '댓글은 최소 1자 이상이어야 합니다.' })
  @MaxLength(1000, { message: '댓글은 최대 1000자까지 입력 가능합니다.' })
  content: string;
}
