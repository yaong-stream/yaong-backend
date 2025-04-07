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
  StreamChat,
} from '@lib/entity';
@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(StreamChat)
    private readonly chatRepository: Repository<StreamChat>,
  ) { }

  public createChatHistory(streamId: number, memberId: number, chatId: string, message: string) {
    const chat = this.chatRepository.create({
      id: chatId,
      message,
      stream: {
        id: streamId,
      },
      member: {
        id: memberId,
      },
    });
    return this.chatRepository.save(chat);
  }
}
