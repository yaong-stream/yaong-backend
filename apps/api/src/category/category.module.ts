import {
  Module,
} from '@nestjs/common';
import {
  TypeOrmModule,
} from '@nestjs/typeorm';
import {
  Category,
} from '@api/entities';
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
