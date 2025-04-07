import {
  Injectable,
} from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import {
  Member,
  Post,
  PostLike,
} from '@api/entities';
import {
  PostWithLikeCount,
} from './post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) { }

  public async createPost(
    memberId: number,
    content: string,
  ) {
    let post = this.postRepository.create({
      content,
      member: {
        id: memberId,
      },
    });
    post = await this.postRepository.save(post);
    return post;
  }

  public async getPosts(streamer: string, lastId: number, limit: number = 10) {
    const posts = await this.postRepository.createQueryBuilder('post')
      .addSelect((sq) => sq.select('count(like.id)')
        .from(PostLike, 'like')
        .where('like.post_id = post.id'), 'like_count')
      .leftJoinAndMapOne('post.member', Member, 'member', 'member.id = post.member_id')
      .where('member.nickname = :streamer AND post.id < :lastId', { streamer, lastId })
      .orderBy('post.id', 'DESC')
      .limit(limit)
      .getRawMany();
    return posts.map((post) => ({
      id: post.post_id,
      content: post.post_content,
      likeCount: parseInt(post.like_count, 10),
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
      member: {
        id: post.member_id,
        nickname: post.member_nickname,
        profileImage: post.member_profile_image,
      },
    })) as PostWithLikeCount[];
  }

  public async getPostByMemberIdAndId(memberId: number, postId: number) {
    const post = await this.postRepository.createQueryBuilder('post')
      .addSelect((sq) => sq.select('count(like.id)')
        .from(PostLike, 'like')
        .where('like.post_id = post.id'), 'like_count')
      .leftJoinAndMapOne('post.member', Member, 'member', 'member.id = post.member_id')
      .where('member.id = :memberId AND post.id = :postId', { memberId, postId })
      .getRawOne();
    return {
      id: post.post_id,
      content: post.post_content,
      likeCount: parseInt(post.like_count, 10),
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
      member: {
        id: post.member_id,
        nickname: post.member_nickname,
        profileImage: post.member_profile_image,
      },
    } as PostWithLikeCount;
  }

  public async getPost(streamer: string, postId: number) {
    const post = await this.postRepository.createQueryBuilder('post')
      .addSelect((sq) => sq.select('count(like.id)')
        .from(PostLike, 'like')
        .where('like.post_id = post.id'), 'like_count')
      .leftJoinAndMapOne('post.member', Member, 'member', 'member.id = post.member_id')
      .where('member.nickname = :streamer AND post.id = :postId', { streamer, postId })
      .getRawOne();
    return {
      id: post.post_id,
      content: post.post_content,
      likeCount: parseInt(post.like_count, 10),
      createdAt: post.post_created_at,
      updatedAt: post.post_updated_at,
      member: {
        id: post.member_id,
        nickname: post.member_nickname,
        profileImage: post.member_profile_image,
      },
    } as PostWithLikeCount;
  }

  public updatePost(memberId: number, postId: number, content: string) {
    return this.postRepository.update(
      {
        member: {
          id: memberId,
        },
        id: postId,
      },
      {
        content,
      },
    );
  }

  public deletePost(memberId: number, postId: number) {
    return this.postRepository.delete({
      member: {
        id: memberId,
      },
      id: postId,
    });
  }

  public likePost(postId: number, memberId: number) {
    const like = this.postLikeRepository.create({
      post: {
        id: postId,
      },
      member: {
        id: memberId,
      },
    });
    return this.postLikeRepository.save(like);
  }

  public unlikePost(postId: number, memberId: number) {
    return this.postLikeRepository.delete({
      post: {
        id: postId,
      },
      member: {
        id: memberId,
      },
    });
  }
}
