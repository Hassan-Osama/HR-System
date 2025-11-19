import { Test, TestingModule } from '@nestjs/testing';
import { TimeManagementController } from './time-management.controller';

describe('TimeManagementController', () => {
  let controller: TimeManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeManagementController],
    }).compile();

    controller = module.get<TimeManagementController>(TimeManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
