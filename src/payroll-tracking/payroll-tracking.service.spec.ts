import { Test, TestingModule } from '@nestjs/testing';
import { PayrollTrackingService } from './payroll-tracking.service';

describe('PayrollTrackingService', () => {
  let service: PayrollTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollTrackingService],
    }).compile();

    service = module.get<PayrollTrackingService>(PayrollTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
