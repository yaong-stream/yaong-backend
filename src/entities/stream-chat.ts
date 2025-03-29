import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Member,
} from './member';
import {
  Stream,
} from './stream';

@Entity({
  name: 'stream_chats',
})
export class StreamChat extends DefaultEntity {

  @Column({
    type: 'text',
    name: 'message',
    nullable: false,
  })
  message: string;

  @ManyToOne(() => Stream, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'stream_id',
  })
  stream: Stream;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
