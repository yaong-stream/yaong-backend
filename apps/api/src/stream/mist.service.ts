import * as crypto from 'crypto';
import {
  HttpService,
} from '@nestjs/axios';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  firstValueFrom,
} from 'rxjs';

@Injectable()
export class MistService {

  private readonly mistServer: string;
  private readonly mistUsername: string;
  private readonly mistPassword: string;
  private mistAuthorization: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.mistServer = this.configService.getOrThrow<string>('mistServer.url');
    this.mistUsername = this.configService.getOrThrow<string>('mistServer.username');
    this.mistPassword = this.configService.getOrThrow<string>('mistServer.password');
  }

  async authenticate() {
    try {
      const { data } = await firstValueFrom(this.httpService.post(`${this.mistServer}/api`));
      const challenge = data?.authorize?.status === 'CHALL'
        ? data.authorize.challenge
        : null;
      if (!challenge) {
        return false;
      }
      const hash = this.createMD5Hash(this.createMD5Hash(this.mistPassword) + challenge);
      this.mistAuthorization = `json ${JSON.stringify({ username: this.mistUsername, password: hash })}`;
      return true;
    } catch (e) {
      return false;
    }
  }

  async createStream(key: string) {
    const body = {
      'addstream': {
        [key]: {
          'name': key,
          'source': 'push://',
          'tags': [],
          'stop_sessions': false,
          'DVR': null,
          'cut': null,
          'debug': null,
          'fallback_stream': null,
          'inputtimeout': null,
          'maxkeepaway': null,
          'pagetimeout': null,
          'resume': null,
          'segmentsize': null,
          'processes': [],
        }
      },
      'deletestream': [''],
    };
    const { data } = await firstValueFrom(this.httpService.post(`${this.mistServer}/api`, body, {
      headers: {
        Authorization: this.mistAuthorization,
      },
    }));
    return data?.streams[key]?.name === key;
  }

  async changeStreamKey(key: string, newKey: string) {
    const body = {
      'addstream': {
        [newKey]: {
          'name': newKey,
          'source': 'push://',
          'tags': [],
          'stop_sessions': false,
          'DVR': null,
          'cut': null,
          'debug': null,
          'fallback_stream': null,
          'inputtimeout': null,
          'maxkeepaway': null,
          'pagetimeout': null,
          'resume': null,
          'segmentsize': null,
          'processes': [],
        }
      },
      'deletestream': [key],
    };
    const { data } = await firstValueFrom(this.httpService.post(`${this.mistServer}/api`, body, {
      headers: {
        Authorization: this.mistAuthorization,
      },
    }));
    return data?.streams[key]?.name === key;
  }

  async deleteStream(key: string) {
    const body = {
      'deletestream': [key],
    };
    await firstValueFrom(this.httpService.post(`${this.mistServer}/api`, body, {
      headers: {
        Authorization: this.mistAuthorization,
      },
    }));
    return true;
  }

  private createMD5Hash(key: string) {
    return crypto
      .createHash('md5')
      .update(key)
      .digest('hex');
  }
}
