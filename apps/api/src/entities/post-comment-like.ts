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
  PostComment,
} from './post-comment';
import {
  Member,
} from './member';

@Unique([
  'comment',
  'member',
])
@Entity({
  name: 'post_comment_likes',
})
export class PostCommentLike extends DefaultEntity {

  @Index()
  @ManyToOne(() => PostComment, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'comment_id',
  })
  comment: PostComment;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
