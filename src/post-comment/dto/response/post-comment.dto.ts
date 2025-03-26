import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  PostComment,
} from 'src/entities';
import {
  MemberDto,
} from 'src/member/dto/response';
import { Comment } from 'src/post-comment/post-comment.interface';

export class PostCommentDto {

  @ApiProperty({
    description: '댓글 ID',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '좋은 게시글 감사합니다.',
    required: true,
    type: String,
    nullable: false,
  })
  content: string;

  @ApiProperty({
    description: '댓글 작성일',
    example: '2021-01-01',
    required: false,
    nullable: false,
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: '댓글 수정일',
    example: '2021-01-01',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '댓글 작성자',
    required: true,
    type: MemberDto,
    nullable: false,
  })
  member: MemberDto;

  @ApiProperty({
    description: '댓글 좋아요 수',
    example: 10,
    required: false,
    nullable: false,
    type: Number,
  })
  likeCount: number = 0;

  @ApiProperty({
    description: '대댓글 개수',
    example: 3,
    required: true,
    nullable: false,
    type: Number,
  })
  replyCount: number = 0;

  static from(postComment: Comment) {
    const dto = new PostCommentDto();
    dto.id = postComment.id;
    dto.content = postComment.content;
    dto.replyCount = postComment.replyCount;
    dto.likeCount = postComment.likeCount;
    dto.createdAt = postComment.createdAt;
    dto.updatedAt = postComment.updatedAt;
    dto.member = MemberDto.from(postComment.member.id, postComment.member.nickname, postComment.member.profileImage);
    return dto;
  }
}
