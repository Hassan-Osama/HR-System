import { Module } from '@nestjs/common';
import { PayrollConfigController } from './payroll-config.controller';
import { PayrollConfigService } from './payroll-config.service';

@Module({
  controllers: [PayrollConfigController],
  providers: [PayrollConfigService]
})
export class PayrollConfigModule {}
