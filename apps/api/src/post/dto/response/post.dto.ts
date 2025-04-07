import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  MemberDto,
} from '@api/member/dto/response';
import {
  PostWithLikeCount,
} from '@api/post/post.interface';

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
    description: '게시글 좋아요 수',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  likeCount: number;

  @ApiProperty({
    description: '게시글 작성자',
    required: true,
    type: MemberDto,
    nullable: false,
  })
  member: MemberDto;

  @ApiProperty({
    description: '게시글 작성 시간',
    required: true,
    type: Date,
    nullable: false,
  })
  createdAt: Date;

  @ApiProperty({
    description: '게시글 수정 시간',
    required: true,
    type: Date,
    nullable: false,
  })
  updatedAt: Date;

  static from(post: PostWithLikeCount) {
    const dto = new PostDto();
    dto.id = post.id;
    dto.content = post.content;
    dto.likeCount = post.likeCount;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    dto.member = MemberDto.from(post.member.id, post.member.nickname, post.member.profileImage);
    return dto;
  }
}
