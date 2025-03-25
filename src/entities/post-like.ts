import {
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import {
  DefaultEntity,
} from "./default-entity";
import {
  Post,
} from "./post";
import {
  Member,
} from "./member";

@Entity({
  name: "post_likes",
})
export class PostLike extends DefaultEntity {

  @ManyToOne(() => Post, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({
    name: "post_id",
  })
  post: Post;

  @ManyToOne(() => Member, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({
    name: "member_id",
  })
  member: Member;
}
