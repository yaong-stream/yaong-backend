import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  PostComment,
  PostCommentLike,
} from 'src/entities';
import {
  PostCommentController,
} from './post-comment.controller';
import {
  PostCommentService,
} from './post-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment, PostCommentLike]),
  ],
  controllers: [
    PostCommentController,
  ],
  providers: [
    PostCommentService,
  ],
})
export class PostCommentModule { }
