import { Module } from '@nestjs/common';
import { PayrollExecController } from './payroll-exec.controller';
import { PayrollExecService } from './payroll-exec.service';

@Module({
  controllers: [PayrollExecController],
  providers: [PayrollExecService]
})
export class PayrollExecModule {}
