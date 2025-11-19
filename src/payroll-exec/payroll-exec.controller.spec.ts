import { Test, TestingModule } from '@nestjs/testing';
import { PayrollExecController } from './payroll-exec.controller';

describe('PayrollExecController', () => {
  let controller: PayrollExecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollExecController],
    }).compile();

    controller = module.get<PayrollExecController>(PayrollExecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
