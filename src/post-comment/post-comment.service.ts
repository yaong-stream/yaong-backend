import {
  Injectable,
} from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import {
  Member,
  PostComment,
} from 'src/entities';
import { Comment } from './post-comment.interface';

@Injectable()
export class PostCommentService {

  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
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
      .where('comment.id = :commentId AND comment.parent_id IS NULL', { commentId })
      .leftJoinAndMapOne('comment.member', Member, 'member', 'member.id = comment.member_id')
      .getRawOne();
    return {
      id: comment.comment_id,
      content: comment.comment_content,
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
    return this.postCommentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: [
        'member',
      ],
    });
  }

  public async getComments(postId: number, lastId: number, limit: number = 10) {
    const comments = await this.postCommentRepository.createQueryBuilder('comment')
      .addSelect((sq) => sq
        .select('count(replies.id)')
        .from(PostComment, 'replies')
        .where('replies.parent_id = comment.id'), 'reply_count')
      .where('comment.post_id = :postId AND comment.id < :lastId AND comment.parent_id IS NULL', { postId, lastId })
      .leftJoinAndMapOne('comment.member', Member, 'member', 'member.id = comment.member_id')
      .orderBy('comment.id', 'DESC')
      .limit(limit)
      .getRawMany();
    return comments.map((comment): Comment => ({
      id: comment.comment_id,
      content: comment.comment_content,
      createdAt: comment.comment_created_at,
      updatedAt: comment.comment_updated_at,
      replyCount: parseInt(comment.reply_count, 10),
      member: {
        id: comment.member_id,
        nickname: comment.member_nickname,
        profileImage: comment.member_profile_image,
      },
    }))
  }

  public getCommentReplies(postId: number, commentId: number, firstId: number, limit: number = 10) {
    return this.postCommentRepository.find({
      where: {
        post: {
          id: postId,
        },
        parent: {
          id: commentId,
        },
        id: MoreThan(firstId),
      },
      order: {
        id: 'ASC',
      },
      take: limit,
      relations: [
        'member',
      ],
    });
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
}
