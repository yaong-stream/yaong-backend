import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

@Entity({
  name: 'post_comments',
})
export class PostComment extends DefaultEntity {

  @Column({
    type: 'text',
    nullable: false,
    name: 'content',
  })
  content: string;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'post_id',
  })
  post: Post;

  @ManyToOne(() => PostComment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'parent_id',
  })
  parent: PostComment;

  @OneToMany(() => PostComment, (comment) => comment.parent)
  children: PostComment[];

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'member_id',
  })
  member: Member;
}
