import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class UpdateStreamInfo {

  @ApiProperty({
    description: '방송 제목',
    example: 'XXX님의 방송입니다.',
    type: String,
    required: true,
    minLength: 1,
  })
  @IsString({ message: 'Name must be a string.' })
  @Length(1, 255, { message: 'Name must be longer than 1 character and shorter than 255 characters.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @ApiProperty({
    description: '방송 설명',
    example: 'XXX님의 설명입니다.',
    type: String,
    required: true,
    minLength: 1,
  })
  @IsString({ message: 'Description must be a string.' })
  @Length(1, 255, { message: 'Description must be longer than 1 character and shorter than 255 characters.' })
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

}
