import { Module } from '@nestjs/common';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

@Module({
  controllers: [LeavesController],
  providers: [LeavesService]
})
export class LeavesModule {}
