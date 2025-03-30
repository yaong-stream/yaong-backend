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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  MemberGuard,
  MemberAuth,
} from 'src/auth/auth.guard';
import {
  PostService,
} from './post.service';
import {
  CreatePostDto,
  UpdatePostDto,
} from './dto/request';
import {
  PostDto,
} from './dto/response/post.dto';

@ApiTags('Post')
@Controller()
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) { }

  @ApiOperation({
    summary: '포스트 생성',
    description: '포스트를 생성합니다.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: '포스트 생성 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '포스트 생성 성공',
    type: PostDto,
  })
  @ApiBearerAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  public async createPost(
    @MemberAuth() memberId: number,
    @Body() body: CreatePostDto,
  ) {
    const savedPost = await this.postService.createPost(memberId, body.content);
    const post = await this.postService.getPostByMemberIdAndId(memberId, savedPost.id);
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    return PostDto.from(post);
  }

  @ApiOperation({
    summary: '포스트 조회',
    description: '포스트를 조회합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '포스트 조회 성공',
    type: PostDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':post_id')
  public async getPost(
    @Query('streamer') streamer: string,
    @Param('post_id') postId: number,
  ) {
    if (streamer == null || streamer.length === 0) {
      throw new BadRequestException('Streamer is required');
    }
    const post = await this.postService.getPost(streamer, postId);
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    return PostDto.from(post);
  }

  @ApiOperation({
    summary: '포스트 목록 조회',
    description: '스트리머의 포스트 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'streamer',
    description: '스트리머 닉네임',
    required: true,
    example: 'user',
  })
  @ApiQuery({
    name: 'last_id',
    description: '마지막 포스트 ID',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 포스트 개수',
    required: false,
    example: 10,
  })
  @ApiOkResponse({
    description: '포스트 목록',
    type: PostDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getPosts(
    @Query('streamer') streamer: string,
    @Query('last_id', new ParseIntPipe({ optional: true })) lastId: number = 2147483646,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    if (streamer == null || streamer.length === 0) {
      throw new BadRequestException('Streamer is required');
    }
    const posts = await this.postService.getPosts(streamer, lastId, limit);
    return posts.map(post => PostDto.from(post));
  }

  @ApiOperation({
    summary: '포스트 수정',
    description: '포스트를 수정합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
    required: true,
    example: 1,
  })
  @ApiBody({
    type: UpdatePostDto,
    description: '포스트 수정 정보',
    required: true,
  })
  @ApiOkResponse({
    description: '포스트 수정 성공',
    type: PostDto,
  })
  @ApiBearerAuth()
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':post_id')
  public async updatePost(
    @MemberAuth() memberId: number,
    @Param('post_id') postId: number,
    @Body() body: UpdatePostDto,
  ) {
    let post = await this.postService.getPostByMemberIdAndId(memberId, postId);
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    const updatedPost = await this.postService.updatePost(memberId, postId, body.content);
    if (!updatedPost.affected) {
      throw new BadRequestException('Failed to update post');
    }
    post = await this.postService.getPostByMemberIdAndId(memberId, postId);
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    return PostDto.from(post);
  }

  @ApiOperation({
    summary: '포스트 삭제',
    description: '포스트를 삭제합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '포스트 삭제 성공',
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
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':post_id')
  public async deletePost(
    @MemberAuth() memberId: number,
    @Param('post_id') postId: number,
  ) {
    const result = await this.postService.deletePost(memberId, postId);
    return {
      success: (result.affected || 0) > 0,
    };
  }

  @ApiOperation({
    summary: '포스트 좋아요',
    description: '포스트 좋아요를 추가합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
  })
  @ApiOkResponse({
    description: '포스트 좋아요 추가 성공',
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
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':post_id/like')
  public async likePost(
    @Param('post_id') postId: number,
    @MemberAuth() memberId: number,
  ) {
    try {
      const like = await this.postService.likePost(postId, memberId);
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
    summary: '포스트 좋아요 취소',
    description: '포스트 좋아요를 취소합니다.',
  })
  @ApiParam({
    name: 'post_id',
    description: '포스트 ID',
    required: true,
    example: 1,
  })
  @ApiOkResponse({
    description: '포스트 좋아요 취소 성공',
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
  @UseGuards(MemberGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':post_id/like')
  public async unlikePost(
    @Param('post_id') postId: number,
    @MemberAuth() memberId: number,
  ) {
    const result = await this.postService.unlikePost(postId, memberId);
    return {
      success: (result.affected || 0) > 0,
    };
  }
}
