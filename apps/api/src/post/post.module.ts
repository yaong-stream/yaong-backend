import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Post,
  PostLike,
} from '@lib/entity';
import {
  PostController,
} from './post.controller';
import {
  PostService,
} from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostLike,
    ]),
  ],
  controllers: [
    PostController,
  ],
  providers: [
    PostService,
  ],
})
export class PostModule { }
