import {
  Module,
} from '@nestjs/common';
import {
  Configure,
} from './configure';

@Module({
  imports: [
    Configure,
  ],
})
export class AppModule { }
