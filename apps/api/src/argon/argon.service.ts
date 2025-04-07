import * as argon from 'argon2';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';

@Injectable()
export class ArgonService {

  private readonly authSecret: Buffer;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.authSecret = Buffer.from(this.configService.getOrThrow<string>('authSecret'));
  }

  public hashPassword(password: string) {
    return argon.hash(password, {
      type: argon.argon2id,
      secret: this.authSecret,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  public verifyPassword(digest: string, password: string) {
    return argon.verify(digest, password, { secret: this.authSecret });
  }
}
