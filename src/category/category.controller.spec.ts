import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  Category,
} from 'src/entities';
import {
  CategoryController,
} from './category.controller';
import {
  CategoryService,
} from './category.service';
import {
  CategoryDto,
} from './dto/response';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategories: Category[] = [
    {
      id: 1,
      name: '게임',
      thumbnailImage: 'https://example.com/game.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: '음악',
      thumbnailImage: 'https://example.com/music.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockCategoryDtos = mockCategories.map(category => CategoryDto.from(category));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryController,
      ],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getCategories: jest.fn().mockResolvedValue(mockCategories),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const result = await controller.getCategories();

      expect(result).toEqual(mockCategoryDtos);
      expect(service.getCategories).toHaveBeenCalled();
    });
  });
});
