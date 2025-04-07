import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Category,
} from '@lib/entity';
import {
  CategoryController,
} from './category.controller';
import {
  CategoryService,
} from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [
    CategoryController,
  ],
  providers: [
    CategoryService,
  ],
})
export class CategoryModule { }
