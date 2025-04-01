import {
  Injectable,
} from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  In,
  IsNull,
  Repository,
} from 'typeorm';
import {
  Member,
  Stream,
  StreamHistory,
} from 'src/entities';
import {
  Streaming,
} from './stream.interface';

@Injectable()
export class StreamService {

  constructor(
    @InjectRepository(Stream)
    private readonly streamRepository: Repository<Stream>,
    @InjectRepository(StreamHistory)
    private readonly streamHistoryRepoditory: Repository<StreamHistory>,
  ) { }

  public activateStream(memberId: number, nickname: string, streamKey: string) {
    const stream = this.streamRepository.create({
      name: `${nickname}님의 방송입니다.`,
      description: `${nickname}님의 방송에 오신것을 환영합니다.`,
      streamKey: streamKey,
      streamer: {
        id: memberId,
      },
    });
    return this.streamRepository.save(stream);
  }

  public deactivateStream(memberId: number) {
    return this.streamRepository.delete({
      streamer: {
        id: memberId,
      },
    });
  }

  public async getStreamByMemberId(memberId: number) {
    const stream = await this.streamRepository
      .createQueryBuilder('stream')
      .addSelect((qb) => qb
        .select('CASE WHEN COUNT(history.id) > 0 THEN true ELSE false END')
        .from(StreamHistory, 'history')
        .where('history.stream_id = stream.id'), 'is_live')
      .leftJoinAndMapOne('stream.streamer', Member, 'member', 'stream.member_id = member.id')
      .where('member.id = :memberId', { memberId })
      .getRawOne();
    return {
      id: stream.stream_id,
      name: stream.stream_name,
      description: stream.stream_description,
      thumbnailImage: stream.stream_thumbnail_image,
      streamKey: stream.stream_stream_key,
      isLive: stream.is_live,
      streamer: {
        id: stream.member_id,
        nickname: stream.member_nickname,
        profileImage: stream.member_profile_image,
      },
    } as Streaming;
  }

  public updateStream(streamId: number, name: string, description: string) {
    return this.streamRepository.update(
      {
        id: streamId,
      },
      {
        name,
        description,
      },
    );
  }

  public getStreamByStreamKey(streamKey: string) {
    return this.streamRepository.findOneBy({
      streamKey,
    });
  }

  public async getStreamByStreamerName(streamerName: string) {
    const stream = await this.streamRepository
      .createQueryBuilder('stream')
      .addSelect((qb) => qb
        .select('CASE WHEN COUNT(history.id) > 0 THEN true ELSE false END')
        .from(StreamHistory, 'history')
        .where('history.stream_id = stream.id AND history.ended_at IS NULL'), 'is_live')
      .leftJoinAndMapOne('stream.streamer', Member, 'member', 'stream.member_id = member.id')
      .where('member.nickname = :streamerName', { streamerName })
      .getRawOne();
    if (stream == null) {
      return;
    }
    return {
      id: stream.stream_id,
      name: stream.stream_name,
      description: stream.stream_description,
      thumbnailImage: stream.stream_thumbnail_image,
      streamKey: stream.stream_stream_key,
      isLive: stream.is_live,
      streamer: {
        id: stream.member_id,
        nickname: stream.member_nickname,
        profileImage: stream.member_profile_image,
      },
    } as Streaming;
  }

  public async getLiveStreams() {
    const histories = await this.streamHistoryRepoditory
      .createQueryBuilder('history')
      .select('DISTINCT history.stream_id', 'stream_id')
      .where('history.ended_at IS NULL')
      .getRawMany();
    const liveIds = histories.map((history) => history.stream_id) as number[];
    const liveStreams = await this.streamRepository
      .createQueryBuilder('stream')
      .addSelect((qb) => qb
        .select('CASE WHEN COUNT(history.id) > 0 THEN true ELSE false END')
        .from(StreamHistory, 'history')
        .where('history.stream_id = stream.id AND history.ended_at IS NULL'), 'is_live')
      .leftJoinAndMapOne('stream.streamer', Member, 'member', 'stream.member_id = member.id')
      .where('stream.id IN(:...liveIds)', { liveIds })
      .getRawMany();
    return liveStreams.map((stream) => ({
      id: stream.stream_id,
      name: stream.stream_name,
      description: stream.stream_description,
      thumbnailImage: stream.stream_thumbnail_image,
      streamKey: stream.stream_stream_key,
      isLive: stream.is_live,
      streamer: {
        id: stream.member_id,
        nickname: stream.member_nickname,
        profileImage: stream.member_profile_image,
      },
    } as Streaming));
  }

  public createStreamHistory(stream: Stream) {
    const history = this.streamHistoryRepoditory.create({
      stream,
    });
    return this.streamHistoryRepoditory.save(history);
  }

  public async endStreamHistory(streamKey: string) {
    const streams = await this.streamHistoryRepoditory.find({
      where: {
        stream: {
          streamKey,
        },
        endedAt: IsNull(),
      },
    });
    return this.streamHistoryRepoditory.save(streams.map((stream) => {
      stream.endedAt = new Date();
      return stream;
    }))
  }
}
