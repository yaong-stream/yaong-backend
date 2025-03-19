import {
  ConfigModule,
} from "@nestjs/config";

const env = () => ({
  port: parseInt(process.env.PORT || "4000"),
});
export const Configure = ConfigModule.forRoot({
  load: [
    env,
  ],
});
