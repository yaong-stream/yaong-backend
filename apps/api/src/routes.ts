import {
  RouterModule,
} from '@nestjs/core';
import {
  HealthModule,
} from './health/health.module';
import {
  AuthModule,
} from './auth/auth.module';
import {
  MemberModule,
} from './member/member.module';
import {
  PostModule,
} from './post/post.module';
import {
  PostCommentModule,
} from './post-comment/post-comment.module';
import {
  StreamModule,
} from './stream/stream.module';
import {
  CategoryModule,
} from './category/category.module';
import {
  S3Module,
} from './s3/s3.module';

export const Routes = RouterModule.register([
  {
    path: '/api',
    children: [
      {
        path: 'v1',
        children: [
          {
            path: 'health',
            module: HealthModule,
          },
          {
            path: 'auth',
            module: AuthModule,
          },
          {
            path: 'members',
            module: MemberModule,
          },
          {
            path: 'posts',
            module: PostModule,
            children: [
              {
                path: ':post_id/comments',
                module: PostCommentModule,
              }
            ],
          },
          {
            path: 'streams',
            module: StreamModule,
          },
          {
            path: 'categories',
            module: CategoryModule,
          },
          {
            path: 's3',
            module: S3Module,
          },
        ],
      },
    ],
  },
]);

export const RegisteredModules = [
  HealthModule,
  AuthModule,
  MemberModule,
  PostModule,
  PostCommentModule,
  StreamModule,
  CategoryModule,
  S3Module,
];
