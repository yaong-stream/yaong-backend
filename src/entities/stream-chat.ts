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
  Stream,
} from 'nodemailer/lib/xoauth2';
import {
  Member,
} from './member';

@Entity({
  name: 'stream_chats',
})
export class StreamChat extends DefaultEntity {

  @Column({
    type: 'text',
    name: 'chat',
    nullable: false,
  })
  chat: string;

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
