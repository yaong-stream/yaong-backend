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

@Module({
  imports: [
    Configure,
    PostgresDataSource,
    Redis,
    Routes,
    ...RegisteredModules,
  ],
})
export class AppModule { }
