import {
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Stream,
} from './stream';
import {
  Member,
} from './member';

@Unique([
  'stream',
  'member',
])
@Entity({
  name: 'followers',
})
export class Follower extends DefaultEntity {

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
