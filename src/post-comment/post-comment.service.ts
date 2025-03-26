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
  PostComment,
} from 'src/entities';

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

  public getComment(commentId: number) {
    return this.postCommentRepository.findOne({
      where: {
        id: commentId,
      },
      relations: [
        'member',
      ],
    });
  }

  public getComments(postId: number, lastId: number, limit: number = 10) {
    return this.postCommentRepository.find({
      where: {
        post: {
          id: postId,
        },
        id: LessThan(lastId),
      },
      order: {
        id: 'DESC',
      },
      take: limit,
      relations: [
        'member',
      ],
    });
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

  public updateComment(commentId: number, memberId: number, content: string) {
    return this.postCommentRepository.update(
      {
        id: commentId,
        member: {
          id: memberId,
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
