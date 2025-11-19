import { Module } from '@nestjs/common';
import { PayrollTrackingController } from './payroll-tracking.controller';
import { PayrollTrackingService } from './payroll-tracking.service';

@Module({
  controllers: [PayrollTrackingController],
  providers: [PayrollTrackingService]
})
export class PayrollTrackingModule {}
