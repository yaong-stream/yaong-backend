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

@Entity({
  name: 'posts',
})
export class Post extends DefaultEntity {

  @Column({
    type: 'text',
    nullable: false,
    name: 'content',
  })
  content: string;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
