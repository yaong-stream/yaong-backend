import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  MemberModule,
} from 'src/member/member.module';
import {
  ArgonModule,
} from 'src/argon/argon.module';
import {
  LoginHistory,
} from 'src/entities';
import {
  AuthController,
} from './auth.controller';
import {
  AuthService,
} from './auth.service';
import {
  AuthJwt,
} from './auth.jwt';

@Module({
  imports: [
    AuthJwt,
    MemberModule,
    ArgonModule,
    TypeOrmModule.forFeature([LoginHistory]),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule { }
