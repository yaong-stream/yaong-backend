import {
  Module,
} from '@nestjs/common';
import {
  AuthController,
} from './auth.controller';
import {
  AuthService,
} from './auth.service';
import {
  AuthJwt,
} from './auth.jwt';
import {
  MemberModule,
} from 'src/member/member.module';
import {
  ArgonModule,
} from 'src/argon/argon.module';

@Module({
  imports: [
    AuthJwt,
    MemberModule,
    ArgonModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
