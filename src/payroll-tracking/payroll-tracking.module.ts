import { forwardRef, Module } from '@nestjs/common';
import { PayrollTrackingController } from './payroll-tracking.controller';
import { PayrollTrackingService } from './payroll-tracking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { refunds, refundsSchema } from './models/refunds.schema';
import { claims, claimsSchema } from './models/claims.schema';
import { disputes, disputesSchema } from './models/disputes.schema';
import { PayrollConfigurationModule } from 'src/payroll-configuration/payroll-configuration.module';
import { PayrollExecutionModule } from 'src/payroll-execution/payroll-execution.module';

@Module({
  
  imports: [
    PayrollConfigurationModule,forwardRef(()=> PayrollExecutionModule),
    MongooseModule.forFeature([
      { name: refunds.name, schema: refundsSchema },
      { name: claims.name, schema: claimsSchema },
      { name: disputes.name, schema: disputesSchema },
    ])],
  controllers: [PayrollTrackingController],
  providers: [PayrollTrackingService],
  exports:[PayrollTrackingService]
})
export class PayrollTrackingModule { }
