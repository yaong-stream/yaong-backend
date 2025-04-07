import {
  ApiProperty,
} from '@nestjs/swagger';

export class StreamKeyDto {
  @ApiProperty({
    description: '스트림 키',
    example: '1234567890',
  })
  streamKey: string;

  static from(streamKey: string) {
    const dto = new StreamKeyDto();
    dto.streamKey = streamKey;
    return dto;
  }
}
