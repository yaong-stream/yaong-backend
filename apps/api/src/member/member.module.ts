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
  MemberCredential,
} from '@lib/entity';
import {
  MailerModule,
} from '@api/mailer/mailer.module';
import {
  ArgonModule,
} from '@api/argon/argon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberCredential]),
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
