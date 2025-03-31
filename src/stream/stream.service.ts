import {
  Injectable,
} from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import {
  IsNull,
  Repository,
} from 'typeorm';
import {
  Stream,
  StreamHistory,
} from 'src/entities';

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
      member: {
        id: memberId,
      },
    });
    return this.streamRepository.save(stream);
  }

  public deactivateStream(memberId: number) {
    return this.streamRepository.delete({
      member: {
        id: memberId,
      },
    });
  }

  public getStreamByMemberId(memberId: number) {
    return this.streamRepository.findOne({
      where: {
        member: {
          id: memberId,
        },
      },
      relations: [
        'member',
      ],
    });
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
