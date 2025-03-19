import {
  Module,
} from '@nestjs/common';
import {
  Configure,
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
    Routes,
    ...RegisteredModules,
  ],
})
export class AppModule { }
