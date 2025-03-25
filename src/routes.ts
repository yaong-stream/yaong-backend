import {
  RouterModule,
} from "@nestjs/core";
import {
  HealthModule,
} from "./health/health.module";
import {
  AuthModule,
} from "./auth/auth.module";
import {
  MemberModule,
} from "./member/member.module";
import {
  PostModule,
} from "./post/post.module";

export const Routes = RouterModule.register([
  {
    path: "/api",
    children: [
      {
        path: "v1",
        children: [
          {
            path: "health",
            module: HealthModule,
          },
          {
            path: "auth",
            module: AuthModule,
          },
          {
            path: "member",
            module: MemberModule,
          },
          {
            path: "post",
            module: PostModule,
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
];
