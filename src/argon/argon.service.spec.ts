import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ArgonService,
} from './argon.service';

describe('ArgonService', () => {
  let service: ArgonService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArgonService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('test-secret-key'),
          },
        },
      ],
    }).compile();

    service = module.get<ArgonService>(ArgonService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'test-password';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'test-password';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'test-password';
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.verifyPassword(hashedPassword, password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'test-password';
      const wrongPassword = 'wrong-password';
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.verifyPassword(hashedPassword, wrongPassword);
      expect(isValid).toBe(false);
    });
  });
});
