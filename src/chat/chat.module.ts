import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Stream,
  StreamChat,
} from 'src/entities';
import {
  MemberModule,
} from 'src/member/member.module';
import {
  ChatGateway,
} from './chat.gateway';
import {
  ChatService,
} from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream, StreamChat]),
    MemberModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
  ],
})
export class ChatModule { }
