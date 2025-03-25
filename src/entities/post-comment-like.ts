import {
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import {
  DefaultEntity,
} from "./default-entity";
import {
  PostComment,
} from "./post-comment";
import {
  Member,
} from "./member";

@Entity({
  name: "post_comment_likes",
})
export class PostCommentLike extends DefaultEntity {

  @ManyToOne(() => PostComment, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({
    name: "post_comment_id",
  })
  postComment: PostComment;

  @ManyToOne(() => Member, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({
    name: "member_id",
  })
  member: Member;
}
