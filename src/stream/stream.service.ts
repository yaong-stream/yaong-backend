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
} from 'src/entities';

@Injectable()
export class StreamService {

  constructor(
    @InjectRepository(Stream)
    private readonly streamRepository: Repository<Stream>,
  ) { }

  public activateStream(memberId: number, nickname: string) {
    const stream = this.streamRepository.create({
      name: `${nickname}님의 방송입니다.`,
      description: `${nickname}님의 방송에 오신것을 환영합니다.`,
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

  public getStreams(lastId?: number, limit: number = 20,) {
    this.streamRepository.find({

      where: {
        histories: {
          endedAt: IsNull(),
        },
      },
      relations: [
        'histories',
        'member',
      ],
      order: {
        histories: {
          createdAt: 'ASC',
        },
      },
      take: limit,
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
}
