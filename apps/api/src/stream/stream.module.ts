import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  HttpModule,
} from '@nestjs/axios';
import {
  Follower,
  Stream,
  StreamHistory,
} from '@api/entities';
import {
  MemberModule,
} from '@api/member/member.module';
import {
  StreamController,
} from './stream.controller';
import {
  StreamService,
} from './stream.service';
import {
  MistService,
} from './mist.service';
import {
  FollowerService,
} from './following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream, StreamHistory, Follower]),
    HttpModule.register({ timeout: 5000 }),
    MemberModule,
  ],
  controllers: [
    StreamController,
  ],
  providers: [
    StreamService,
    MistService,
    FollowerService
  ],
})
export class StreamModule { }
