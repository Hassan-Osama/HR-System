import { Test, TestingModule } from '@nestjs/testing';
import { PayrollTrackingController } from './payroll-tracking.controller';

describe('PayrollTrackingController', () => {
  let controller: PayrollTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollTrackingController],
    }).compile();

    controller = module.get<PayrollTrackingController>(PayrollTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
