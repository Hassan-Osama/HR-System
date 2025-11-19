import { Test, TestingModule } from '@nestjs/testing';
import { PayrollExecService } from './payroll-exec.service';

describe('PayrollExecService', () => {
  let service: PayrollExecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollExecService],
    }).compile();

    service = module.get<PayrollExecService>(PayrollExecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
