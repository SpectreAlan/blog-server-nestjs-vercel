import { Test, TestingModule } from '@nestjs/testing';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';

describe('VisitorController', () => {
  let controller: VisitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitorController],
      providers: [VisitorService],
    }).compile();

    controller = module.get<VisitorController>(VisitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
