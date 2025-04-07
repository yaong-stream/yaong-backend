import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CategoryService,
} from './category.service';
import {
  CategoryDto,
} from './dto/response';

@ApiTags('Category')
@Controller()
export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @ApiOperation({
    summary: '카테고리 목록',
    description: '카테고리 전체 목록 입니다.'
  })
  @ApiOkResponse({
    description: '카테고리 목록',
    type: [CategoryDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  public async getCategories() {
    const categories = await this.categoryService.getCategories();
    return categories.map((category) => CategoryDto.from(category));
  }
}
