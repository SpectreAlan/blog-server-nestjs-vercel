import { Test, TestingModule } from '@nestjs/testing';
import { PoemService } from './poem.service';

describe('PoemService', () => {
  let service: PoemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoemService],
    }).compile();

    service = module.get<PoemService>(PoemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
