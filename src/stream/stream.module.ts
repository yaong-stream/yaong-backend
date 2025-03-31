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
  Stream,
  StreamHistory,
} from 'src/entities';
import {
  MemberModule,
} from 'src/member/member.module';
import {
  StreamController,
} from './stream.controller';
import {
  StreamService,
} from './stream.service';
import {
  MistService,
} from './mist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream, StreamHistory]),
    HttpModule.register({ timeout: 5000 }),
    MemberModule,
  ],
  controllers: [
    StreamController,
  ],
  providers: [
    StreamService,
    MistService,
  ],
})
export class StreamModule { }
