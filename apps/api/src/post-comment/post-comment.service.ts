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
  PostComment,
  PostCommentLike,
} from '@api/entities';
import {
  Comment,
  CommentReply,
} from './post-comment.interface';

@Injectable()
export class PostCommentService {

  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostCommentLike)
    private readonly postCommentLikeRepository: Repository<PostCommentLike>,
  ) { }

  public createComment(postId: number, memberId: number, content: string) {
    const comment = this.postCommentRepository.create({
      content,
      post: {
        id: postId,
      },
      member: {
        id: memberId,
      },
    });
    return this.postCommentRepository.save(comment);
  }

  public createCommentReply(postId: number, commentId: number, memberId: number, content: string) {
    const reply = this.postCommentRepository.create({
      content,
      post: {
        id: postId,
      },
      parent: {
        id: commentId,
      },
      member: {
        id: memberId,
      },
    });
    return this.postCommentRepository.save(reply);
  }

  public async getComment(commentId: number) {
    const comment = await this.postCommentRepository.createQueryBuilder('comment')
      .addSelect((sq) => sq
        .select('count(replies.id)')
        .from(PostComment, 'replies')
        .where('replies.parent_id = comment.id'), 'reply_count')
      .addSelect((sq) => sq
        .select('count(like.id)')
        .from(PostCommentLike, 'like')
        .where('like.comment_id = comment.id'), 'like_count')
      .where('comment.id = :commentId AND comment.parent_id IS NULL', { commentId })
      .leftJoinAndMapOne('comment.member', Member, 'member', 'member.id = comment.member_id')
      .getRawOne();
    return {
      id: comment.comment_id,
      content: comment.comment_content,
      likeCount: parseInt(comment.like_count, 10),
      createdAt: comment.comment_created_at,
      updatedAt: comment.comment_updated_at,
      replyCount: parseInt(comment.reply_count, 10),
      member: {
        id: comment.member_id,
        nickname: comment.member_nickname,
        profileImage: comment.member_profile_image,
      },
    } as Comment;
  }

  public async getCommentReply(commentId: number) {
    const reply = await this.postCommentRepository.createQueryBuilder('reply')
      .addSelect((sq) => sq
        .select('count(like.id)')
        .from(PostCommentLike, 'like')
        .where('like.comment_id = reply.id'), 'like_count')
      .where('reply.parent_id = :commentId', { commentId })
      .leftJoinAndMapOne('reply.member', Member, 'member', 'member.id = reply.member_id')
      .getRawOne();
    return {
      id: reply.reply_id,
      content: reply.reply_content,
      likeCount: parseInt(reply.like_count, 10),
      createdAt: reply.reply_created_at,
      updatedAt: reply.reply_updated_at,
      member: {
        id: reply.member_id,
        nickname: reply.member_nickname,
        profileImage: reply.member_profile_image,
      },
    };
  }

  public async getComments(postId: number, lastId: number, limit: number = 10) {
    const comments = await this.postCommentRepository.createQueryBuilder('comment')
      .addSelect((sq) => sq
        .select('count(replies.id)')
        .from(PostComment, 'replies')
        .where('replies.parent_id = comment.id'), 'reply_count')
      .addSelect((sq) => sq
        .select('count(like.id)')
        .from(PostCommentLike, 'like')
        .where('like.comment_id = comment.id'), 'like_count')
      .where('comment.post_id = :postId AND comment.id < :lastId AND comment.parent_id IS NULL', { postId, lastId })
      .leftJoinAndMapOne('comment.member', Member, 'member', 'member.id = comment.member_id')
      .orderBy('comment.id', 'DESC')
      .limit(limit)
      .getRawMany();
    return comments.map((comment): Comment => ({
      id: comment.comment_id,
      content: comment.comment_content,
      likeCount: parseInt(comment.like_count, 10),
      replyCount: parseInt(comment.reply_count, 10),
      createdAt: comment.comment_created_at,
      updatedAt: comment.comment_updated_at,
      member: {
        id: comment.member_id,
        nickname: comment.member_nickname,
        profileImage: comment.member_profile_image,
      },
    }))
  }

  public async getCommentReplies(postId: number, commentId: number, firstId: number, limit: number = 10) {
    const replies = await this.postCommentRepository.createQueryBuilder('reply')
      .addSelect((sq) => sq
        .select('count(like.id)')
        .from(PostCommentLike, 'like')
        .where('like.comment_id = reply.id'), 'like_count')
      .where('reply.post_id = :postId AND reply.parent_id = :commentId AND reply.id > :firstId', { postId, commentId, firstId })
      .leftJoinAndMapOne('reply.member', Member, 'member', 'member.id = reply.member_id')
      .orderBy('reply.id', 'ASC')
      .limit(limit)
      .getRawMany();
    return replies.map((reply): CommentReply => ({
      id: reply.reply_id,
      content: reply.reply_content,
      likeCount: parseInt(reply.like_count, 10),
      createdAt: reply.reply_created_at,
      updatedAt: reply.reply_updated_at,
      member: {
        id: reply.member_id,
        nickname: reply.member_nickname,
        profileImage: reply.member_profile_image,
      },
    }));
  }

  public updateComment(postId: number, commentId: number, memberId: number, content: string) {
    return this.postCommentRepository.update(
      {
        id: commentId,
        member: {
          id: memberId,
        },
        post: {
          id: postId,
        },
      },
      {
        content,
      },
    );
  }

  public updateCommentReply(postId: number, commentId: number, replyId: number, memberId: number, content: string) {
    return this.postCommentRepository.update(
      {
        id: replyId,
        member: {
          id: memberId,
        },
        parent: {
          id: commentId,
        },
        post: {
          id: postId,
        },
      },
      {
        content,
      },
    );
  }

  public deleteComment(postId: number, commentId: number, memberId: number) {
    return this.postCommentRepository.delete({
      id: commentId,
      member: {
        id: memberId,
      },
      post: {
        id: postId,
      },
    });
  }

  public likeComment(postId: number, commentId: number, memberId: number) {
    const like = this.postCommentLikeRepository.create({
      comment: {
        id: commentId,
      },
      member: {
        id: memberId,
      },
    });
    return this.postCommentLikeRepository.save(like);
  }

  public unlikeComment(postId: number, commentId: number, memberId: number) {
    return this.postCommentLikeRepository.delete({
      comment: {
        id: commentId,
      },
      member: {
        id: memberId,
      },
    });
  }
}
