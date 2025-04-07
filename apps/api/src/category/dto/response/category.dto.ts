import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  Category,
} from '@lib/entity';

export class CategoryDto {

  @ApiProperty({
    description: '카테고리 고유 식별자',
    example: 1,
    required: true,
    type: Number,
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: '카테고리 명',
    example: '게임',
    required: true,
    type: String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: '카테고리 이미지',
    example: 'https://cdn.narumir.io/abc.webp',
    required: true,
    type: String,
    nullable: false,
  })
  thumbnailImage: string;

  static from(category: Category) {
    const dto = new CategoryDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.thumbnailImage = category.thumbnailImage;
    return dto;
  }
}
