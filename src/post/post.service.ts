import {
  Injectable,
} from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  LessThan,
  Repository,
} from 'typeorm';
import {
  Post,
} from 'src/entities';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
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

  public getPosts(streamer: string, lastId: number, limit: number = 10) {
    return this.postRepository.find({
      where: {
        member: {
          nickname: streamer,
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

  public getPostByMemberIdAndId(memberId: number, id: number) {
    return this.postRepository.findOne({
      where: {
        member: {
          id: memberId,
        },
        id,
      },
      relations: [
        'member',
      ],
    });
  }

  public getPost(streamer: string, id: number) {
    return this.postRepository.findOne({
      where: {
        member: {
          nickname: streamer,
        },
        id,
      },
      relations: [
        'member',
      ],
    });
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
}
