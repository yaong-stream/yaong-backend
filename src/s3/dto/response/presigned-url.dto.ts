import {
  ApiProperty,
} from '@nestjs/swagger';

export class PresignedUrlDto {

  @ApiProperty({
    description: 'presignedUrl',
    example: 'https://s3.amazonaws.com/presigned-url',
    type: String,
    required: true,
    nullable: false,
  })
  presignedUrl: string;

  @ApiProperty({
    description: 'key',
    example: 'https://cdn.example.com/presigned-url',
    type: String,
    required: true,
    nullable: false,
  })
  key: string;

  static from(presignedUrl: string, key: string) {
    const dto = new PresignedUrlDto();
    dto.presignedUrl = presignedUrl;
    dto.key = key;
    return dto;
  }
}
