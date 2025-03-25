import { ApiProperty } from '@nestjs/swagger';
import {
  Post,
} from 'src/entities';
import {
  MemberDto,
} from 'src/member/dto/response';

export class PostDto {

  @ApiProperty({
    description: '게시글 고유 식별자',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '게시글 내용',
    example: '게시글 내용',
    required: true,
    type: String,
    nullable: false,
  })
  content: string;

  @ApiProperty({
    description: '게시글 작성자',
    required: true,
    type: MemberDto,
    nullable: false,
  })
  member: MemberDto;

  static from(post: Post) {
    const dto = new PostDto();
    dto.id = post.id;
    dto.content = post.content;
    dto.member = MemberDto.from(post.member);
    return dto;
  }
}
