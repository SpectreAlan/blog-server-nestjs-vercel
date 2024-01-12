import { Test, TestingModule } from '@nestjs/testing';
import { PoemController } from './poem.controller';
import { PoemService } from './poem.service';

describe('PoemController', () => {
  let controller: PoemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoemController],
      providers: [PoemService],
    }).compile();

    controller = module.get<PoemController>(PoemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
