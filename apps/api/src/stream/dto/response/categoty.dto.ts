import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  StreamCategory,
} from '@api/stream/stream.interface';

export class CategoryDto {

  @ApiProperty({
    description: '카테코리 고유 식별자',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '카테고리 명',
    example: 'Just Chat',
    required: true,
    type: String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: '카테고리 이미지',
    example: 'https://example.com/profile.jpg',
    required: true,
    type: String,
    nullable: false,
  })
  thumbnailImage: string;

  static from(category: StreamCategory) {
    const dto = new CategoryDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.thumbnailImage = category.thumbnailImage;
    return dto;
  }
}
