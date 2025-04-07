import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Member,
  MemberCredential,
  LoginHistory,
  Post,
  PostLike,
  PostComment,
  PostCommentLike,
  Stream,
  Category,
  StreamHistory,
  Follower,
  StreamChat,
} from '@api/entities';
import {
  EntitySchema,
  MixedList,
} from 'typeorm';

const entities: MixedList<string | Function | EntitySchema<any>> = [
  Member,
  MemberCredential,
  LoginHistory,
  Post,
  PostLike,
  PostComment,
  PostCommentLike,
  Stream,
  StreamHistory,
  StreamChat,
  Category,
  Follower,
];

export const PostgresDataSource = TypeOrmModule.forRootAsync({
  imports: [
    ConfigModule,
  ],
  inject: [
    ConfigService,
  ],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    database: 'yaong',
    schema: 'public',
    host: configService.getOrThrow<string>('database.host'),
    port: configService.getOrThrow<number>('database.port'),
    username: configService.getOrThrow<string>('database.username'),
    password: configService.getOrThrow<string>('database.password'),
    synchronize: !configService.getOrThrow<boolean>('isProduction'),
    logging: !configService.getOrThrow<boolean>('isProduction'),
    entities,
  }),
});
