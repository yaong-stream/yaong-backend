import * as passport from 'passport';
import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  MemberModule,
} from '@api/member/member.module';
import {
  ArgonModule,
} from '@api/argon/argon.module';
import {
  LoginHistory,
} from '@api/entities';
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
  AuthLocalStrategy,
} from './auth.local-strategy';
import {
  PassportModule,
} from '@nestjs/passport';
import { AuthSerializer } from './auth.serializer';

@Module({
  imports: [
    AuthJwt,
    MemberModule,
    ArgonModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([LoginHistory]),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    AuthLocalStrategy,
    AuthSerializer,
  ],
})
export class AuthModule { }
