import { Test, TestingModule } from '@nestjs/testing';
import { PayrollConfigurationService } from './payroll-configuration.service';

describe('PayrollConfigurationService', () => {
  let service: PayrollConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollConfigurationService],
    }).compile();

    service = module.get<PayrollConfigurationService>(PayrollConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
