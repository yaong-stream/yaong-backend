import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreatePreSignedUrlDto {

  @ApiProperty({
    description: '파일 확장자',
    example: 'png',
    required: true,
    type: String,
    nullable: false,
  })
  @IsString({ message: 'extension must be a string' })
  @IsNotEmpty({ message: 'extension is required' })
  extension: string;
}
