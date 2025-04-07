import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ChatMessage {

  @IsString({ message: 'message must be a string' })
  @IsNotEmpty({ message: 'message is required' })
  message: string;
}
