import { Test, TestingModule } from '@nestjs/testing';
import { PayrollExecutionController } from './payroll-execution.controller';

describe('PayrollExecutionController', () => {
  let controller: PayrollExecutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollExecutionController],
    }).compile();

    controller = module.get<PayrollExecutionController>(PayrollExecutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
