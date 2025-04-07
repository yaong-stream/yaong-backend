import {
  Module,
} from '@nestjs/common';
import {
  Configure,
  Redis,
} from './configure';
import {
  RegisteredModules,
  Routes,
} from './routes';
import {
  PostgresDataSource,
} from './configure/database';
import {
  ChatModule,
} from './chat/chat.module';

@Module({
  imports: [
    Configure,
    PostgresDataSource,
    Redis,
    Routes,
    ...RegisteredModules,
    ChatModule,
  ],
})
export class AppModule { }
