import { Module } from '@nestjs/common';
import { TimeManagementController } from './time-management.controller';
import { TimeManagementService } from './time-management.service';

@Module({
  controllers: [TimeManagementController],
  providers: [TimeManagementService]
})
export class TimeManagementModule {}
