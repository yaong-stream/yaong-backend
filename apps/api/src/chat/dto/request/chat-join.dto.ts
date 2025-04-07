import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class ChatJoinRoom {

  @IsNumber({}, { message: 'streamId must be a number' })
  @IsNotEmpty({ message: 'streamId is required' })
  streamId: number;
}
