import { Test, TestingModule } from '@nestjs/testing';
import { PayrollConfigurationController } from './payroll-configuration.controller';

describe('PayrollConfigurationController', () => {
  let controller: PayrollConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayrollConfigurationController],
    }).compile();

    controller = module.get<PayrollConfigurationController>(PayrollConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
