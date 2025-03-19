import {
  ConfigModule,
} from "@nestjs/config";

const env = () => ({
  port: parseInt(process.env.PORT || "4000"),
  isProduction: process.env.NODE_ENV === "production",
});

export const Configure = ConfigModule.forRoot({
  load: [
    env,
  ],
});
