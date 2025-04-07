import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  getRepositoryToken,
} from '@nestjs/typeorm';
import {
  Repository,
} from 'typeorm';
import {
  Category,
} from '@lib/entity';
import {
  CategoryService,
} from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue(mockCategories),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const result = await service.getCategories();

      expect(result).toEqual(mockCategories);
      expect(repository.find).toHaveBeenCalledWith({
        order: {
          name: 'ASC',
        },
      });
    });
  });
});
