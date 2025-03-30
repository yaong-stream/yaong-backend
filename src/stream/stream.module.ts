import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Stream,
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
@Module({
  imports: [
    TypeOrmModule.forFeature([Stream]),
    MemberModule,
  ],
  controllers: [
    StreamController,
  ],
  providers: [
    StreamService,
  ],
})
export class StreamModule { }
