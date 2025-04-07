import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  MemberGuard,
  MemberAuth,
} from '@api/auth/auth.guard';
import {
  PostCommentService,
} from './post-comment.service';
import {
  PostCommentDto,
  PostReplyDto,
} from './dto/response';
import {
  CreatePostCommentDto,
  UpdatePostCommentDto,
} from './dto/request';

@ApiTags('Post Comment')
@Controller()
export class PostCommentController {

  constructor(
    private readonly postCommentService: PostCommentService,
  ) { }

  @ApiOperation({
    summary: '댓글 작성',
    description: '게시글에 댓글을 작성합니다.'
  })
  @ApiBody({
    type: CreatePostCommentDto,
    description: '댓글 정보',
    required: true,
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '댓글 작성 성공 여부',
    type: PostCommentDto,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':post_id')
  public async createComment(
    @Param('post_id') postId: number,
    @MemberAuth() memberId: number,
    @Body() body: CreatePostCommentDto,
  ) {
    const savedComment = await this.postCommentService.createComment(postId, memberId, body.content);
    const comment = await this.postCommentService.getComment(savedComment.id);
    if (comment == null) {
      throw new NotFoundException('Comment not found');
    }
    return PostCommentDto.from(comment);
  }

  @ApiOperation({
    summary: '대댓글 작성',
    description: '댓글에 대댓글을 작성합니다.'
  })
  @ApiBody({
    type: CreatePostCommentDto,
    description: '대댓글 정보',
    required: true,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':comment_id/replies')
  public async createCommentReply(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @MemberAuth() memberId: number,
    @Body() body: CreatePostCommentDto,
  ) {
    const savedComment = await this.postCommentService.createCommentReply(postId, commentId, memberId, body.content);
    const comment = await this.postCommentService.getCommentReply(savedComment.id);
    if (comment == null) {
      throw new NotFoundException('Comment not found');
    }
    return PostReplyDto.from(comment);
  }

  @ApiOperation({
    summary: '댓글 목록 조회',
    description: '게시글의 댓글 목록을 조회합니다.'
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiQuery({
    name: 'last_id',
    description: '마지막 댓글 ID',
    required: false,
    example: 99,
  })
  @ApiQuery({
    name: 'limit',
    description: '한 번에 가져올 댓글 수',
    required: false,
    example: 10,
  })
  @ApiOkResponse({
    description: '댓글 목록',
    type: [PostCommentDto]
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getComments(
    @Param('post_id') postId: number,
    @Query('last_id', new ParseIntPipe({ optional: true })) lastId: number = 2147483646,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const comments = await this.postCommentService.getComments(postId, lastId, limit);
    return comments.map(comment => PostCommentDto.from(comment));
  }

  @ApiOperation({
    summary: '대댓글 목록 조회',
    description: '댓글의 대댓글 목록을 조회합니다.'
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiQuery({
    name: 'first_id',
    description: '상위 대댓글 ID',
    required: false,
    example: 0,
  })
  @ApiQuery({
    name: 'limit',
    description: '한 번에 가져올 대댓글 수',
    required: false,
    example: 10,
  })
  @ApiOkResponse({
    description: '대댓글 목록',
    type: [PostCommentDto]
  })
  @HttpCode(HttpStatus.OK)
  @Get(':comment_id/replies')
  public async getCommentReplies(
    @Param('post_id') postId: number,
    @Param('comment_id', new ParseIntPipe()) commentId: number,
    @Query('first_id', new ParseIntPipe({ optional: true })) firstId: number = 0,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    const replies = await this.postCommentService.getCommentReplies(postId, commentId, firstId, limit);
    return replies.map(comment => PostReplyDto.from(comment));
  }

  @ApiOperation({
    summary: '댓글 수정',
    description: '자신이 작성한 댓글을 수정합니다.'
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '댓글 수정 성공 여부',
    type: PostCommentDto,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':comment_id')
  public async updateComment(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @MemberAuth() memberId: number,
    @Body() body: UpdatePostCommentDto,
  ) {
    let comment = await this.postCommentService.getComment(commentId);
    if (comment == null) {
      throw new NotFoundException('Comment not found');
    }
    const result = await this.postCommentService.updateComment(postId, commentId, memberId, body.content);
    if (!result.affected) {
      throw new BadRequestException('Failed to update comment');
    }
    comment = await this.postCommentService.getComment(commentId);
    if (comment == null) {
      throw new NotFoundException('Comment not found');
    }
    return PostCommentDto.from(comment);
  }

  @ApiOperation({
    summary: '대댓글 수정',
    description: '자신이 작성한 대댓글을 수정합니다.'
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'reply_id',
    description: '대댓글 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '대댓글 수정 성공 여부',
    type: PostReplyDto,
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':comment_id/replies/:reply_id')
  public async updateCommentReply(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @Param('reply_id') replyId: number,
    @MemberAuth() memberId: number,
    @Body() body: UpdatePostCommentDto,
  ) {
    let reply = await this.postCommentService.getCommentReply(replyId);
    if (reply == null) {
      throw new NotFoundException('Comment reply not found');
    }
    const result = await this.postCommentService.updateCommentReply(postId, commentId, replyId, memberId, body.content);
    if (!result.affected) {
      throw new BadRequestException('Failed to update comment reply');
    }
    reply = await this.postCommentService.getCommentReply(replyId);
    if (reply == null) {
      throw new NotFoundException('Comment reply not found');
    }
    return PostReplyDto.from(reply);
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description: '자신이 작성한 댓글을 삭제합니다.'
  })
  @ApiParam({
    name: 'post_id',
    description: '게시글 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '댓글 삭제 성공 여부',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':comment_id')
  public async deleteComment(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @MemberAuth() memberId: number,
  ) {
    const result = await this.postCommentService.deleteComment(postId, commentId, memberId);
    return {
      success: (result.affected || 0) > 0,
    };
  }


  @ApiOperation({
    summary: '댓글/대댓글 좋아요',
    description: '댓글/대댓글 좋아요를 추가합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
  })
  @ApiOkResponse({
    description: '댓글/대댓글 좋아요 추가 성공',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
      },
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':comment_id/like')
  public async likePost(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @MemberAuth() memberId: number,
  ) {
    try {
      const like = await this.postCommentService.likeComment(postId, commentId, memberId);
      return {
        success: like != null,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  @ApiOperation({
    summary: '댓글/대댓글 좋아요 취소',
    description: '댓글/대댓글 좋아요를 취소합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
    required: true,
    example: 1,
  })
  @ApiParam({
    name: 'comment_id',
    description: '댓글 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '댓글/대댓글 좋아요 취소 성공',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
      },
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':comment_id/like')
  public async unlikePost(
    @Param('post_id') postId: number,
    @Param('comment_id') commentId: number,
    @MemberAuth() memberId: number,
  ) {
    const result = await this.postCommentService.unlikeComment(postId, commentId, memberId);
    return {
      success: (result.affected || 0) > 0,
    };
  }
}
