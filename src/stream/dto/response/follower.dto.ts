import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  StreamFollowing,
} from 'src/stream/stream.interface';
import {
  StreamDto,
} from './stream.dto';

export class FollowerDto {

  @ApiProperty({
    description: '팔로우 고유 식별자',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '팔로우 중인 스트림(방송)',
    example: StreamDto,
    required: true,
    type: StreamDto,
    nullable: false,
  })
  stream: StreamDto;

  static from(following: StreamFollowing) {
    const dto = new FollowerDto();
    dto.id = following.id;
    dto.stream = StreamDto.from(following.stream);
    return dto;
  }
}
