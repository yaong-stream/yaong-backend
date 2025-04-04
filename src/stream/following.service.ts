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
  Category,
  Follower,
  Member,
  Stream,
  StreamHistory,
} from 'src/entities';
import {
  StreamFollowing,
} from './stream.interface';

@Injectable()
export class FollowerService {

  constructor(
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
  ) { }

  public followStream(streamId: number, memberId: number) {
    const follow = this.followerRepository.create({
      stream: {
        id: streamId,
      },
      member: {
        id: memberId,
      },
    });
    return this.followerRepository.save(follow);
  }

  public unfollowStream(streamId: number, memberId: number) {
    return this.followerRepository.delete({
      stream: {
        id: streamId,
      },
      member: {
        id: memberId,
      },
    });
  }

  public checkFollowing(streamId: number, memberId: number) {
    return this.followerRepository.findOneBy({
      stream: {
        id: streamId,
      },
      member: {
        id: memberId,
      },
    });
  }

  public async getFollowingStreams(memberId: number) {
    const followings = await this.followerRepository
      .createQueryBuilder('following')
      .addSelect((qb) => qb
        .select('CASE WHEN COUNT(history.id) > 0 THEN true ELSE false END')
        .from(StreamHistory, 'history')
        .where('history.stream_id = following.stream_id'), 'is_live')
      .addSelect((qb) => qb
        .select('COUNT(*)')
        .from(Follower, 'follower')
        .where('follower.stream_id = following.stream_id'), 'followers')
      .leftJoinAndMapOne('following.stream', Stream, 'stream', 'following.stream_id = stream.id')
      .leftJoinAndMapOne('stream.streamer', Member, 'member', 'stream.member_id = member.id')
      .leftJoinAndMapOne('stream.category', Category, 'category', 'stream.category_id = category.id')
      .where('following.member_id = :memberId', { memberId })
      .getRawMany();
    return followings.map((following) => ({
      id: following.following_id,
      stream: {
        id: following.stream_id,
        name: following.stream_name,
        description: following.stream_description,
        thumbnailImage: following.stream_thumbnail_image,
        streamKey: following.stream_stream_key,
        isLive: following.is_live,
        followers: parseInt(following.followers || '0', 10),
        category: following.category_id != null ? {
          id: following.category_id,
          name: following.category_name,
          thumbnailImage: following.category_thumbnail_image,
        } : null,
        streamer: {
          id: following.member_id,
          nickname: following.member_nickname,
          profileImage: following.member_profile_image,
        },
      },
    } as StreamFollowing));
  }
}
