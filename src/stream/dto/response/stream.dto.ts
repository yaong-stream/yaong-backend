import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  MemberDto,
} from 'src/member/dto/response';
import {
  Streaming,
} from 'src/stream/stream.interface';

export class StreamDto {

  @ApiProperty({
    description: '스트림 id',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '방송 제목',
    example: 'XXX님의 방송입니다.',
    required: true,
    type: String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: '방송 설명',
    example: 'XXX님의 방송에 오신것을 환영합니다.',
    required: true,
    type: String,
    nullable: false,
  })
  description: string;

  @ApiProperty({
    description: '방송 섬네일 이미지',
    example: 'https://cdn.narumir.io/abc.webp',
    required: true,
    type: String,
    nullable: false,
  })
  thumbnailImage: string;

  @ApiProperty({
    description: '생방송 여부',
    example: true,
    required: true,
    type: Boolean,
    nullable: false,
  })
  isLive: boolean;

  @ApiProperty({
    description: '방송 스트림키',
    example: '39ec2d91fd1d4b51b81438a2147156e4',
    required: true,
    type: String,
    nullable: false,
  })
  streamKey: string;

  @ApiProperty({
    description: '게시글 작성자',
    required: true,
    type: MemberDto,
    nullable: false,
  })
  streamer: MemberDto;

  public static from(stream: Streaming) {
    const dto = new StreamDto();
    dto.id = stream.id;
    dto.name = stream.name;
    dto.description = stream.description;
    dto.thumbnailImage = stream.thumbnailImage;
    dto.isLive = stream.isLive;
    dto.streamKey = stream.streamKey;
    dto.streamer = MemberDto.from(stream.streamer.id, stream.streamer.nickname, stream.streamer.profileImage);
    return dto;
  }
}
