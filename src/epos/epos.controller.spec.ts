import { Test, TestingModule } from '@nestjs/testing';
import { EposController } from './epos.controller';

describe('EposController', () => {
  let controller: EposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EposController],
    }).compile();

    controller = module.get<EposController>(EposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
