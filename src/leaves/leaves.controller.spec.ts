import { Test, TestingModule } from '@nestjs/testing';
import { LeavesController } from './leaves.controller';

describe('LeavesController', () => {
  let controller: LeavesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeavesController],
    }).compile();

    controller = module.get<LeavesController>(LeavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
