import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EposModule } from './epos/epos.module';
import { TimeManagementModule } from './time-management/time-management.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { LeavesModule } from './leaves/leaves.module';
import { PayrollConfigModule } from './payroll-config/payroll-config.module';
import { PayrollExecModule } from './payroll-exec/payroll-exec.module';
import { PayrollTrackingModule } from './payroll-tracking/payroll-tracking.module';

@Module({
  imports: [EposModule, TimeManagementModule, RecruitmentModule, LeavesModule, PayrollConfigModule, PayrollExecModule, PayrollTrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
