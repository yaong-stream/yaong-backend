import {
  ConfigService,
} from '@nestjs/config';
import {
  JwtModule,
} from '@nestjs/jwt';

export const AuthJwt = JwtModule.registerAsync({
  global: true,
  inject: [
    ConfigService,
  ],
  useFactory(configService: ConfigService) {
    return {
      secret: configService.getOrThrow<string>('jwt.accessSecret'),
    };
  },
});
