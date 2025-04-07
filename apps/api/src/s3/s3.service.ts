import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
} from '@nestjs/common';
import {
  ConfigService,
} from '@nestjs/config';
import {
  v4 as uuidv4,
} from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('aws.region'),
    });
  }

  public async getPresignedUrl(key: string) {
    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow<string>('aws.bucket'),
      Key: key,
    });
    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    return {
      url: presignedUrl,
      key: `${this.configService.getOrThrow<string>('aws.cdnUrl')}/${key}`,
    };
  }

  public generateKey(memberId: number, extension: string) {
    return `${memberId}-${uuidv4()}.${extension}`;
  }
}
