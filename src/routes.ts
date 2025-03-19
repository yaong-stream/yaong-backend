import {
  RouterModule,
} from "@nestjs/core";
import {
  HealthModule,
} from "./health/health.module";

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
        ],
      },
    ],
  },
]);

export const RegisteredModules = [
  HealthModule,
];
