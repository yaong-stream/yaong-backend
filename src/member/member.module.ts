import {
  Module,
} from '@nestjs/common';
import {
  MemberController,
} from './member.controller';
import {
  MemberService,
} from './member.service';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Member,
} from 'src/entities';
import {
  MailerModule,
} from 'src/mailer/mailer.module';
import {
  ArgonModule,
} from 'src/argon/argon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    ArgonModule,
    MailerModule,
  ],
  controllers: [
    MemberController,
  ],
  providers: [
    MemberService,
  ],
  exports: [
    MemberService,
  ],
})
export class MemberModule { }
