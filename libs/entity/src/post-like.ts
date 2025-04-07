import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import {
  DefaultEntity,
} from './default-entity';
import {
  Post,
} from './post';
import {
  Member,
} from './member';

@Unique([
  'post',
  'member',
])
@Entity({
  name: 'post_likes',
})
export class PostLike extends DefaultEntity {

  @Index()
  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'post_id',
  })
  post: Post;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
