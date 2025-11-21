import { Test, TestingModule } from '@nestjs/testing';
import { PayrollExecutionService } from './payroll-execution.service';

describe('PayrollExecutionService', () => {
  let service: PayrollExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollExecutionService],
    }).compile();

    service = module.get<PayrollExecutionService>(PayrollExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
