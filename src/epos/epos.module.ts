import { Module } from '@nestjs/common';
import { EposController } from './epos.controller';
import { EposService } from './epos.service';

@Module({
  controllers: [EposController],
  providers: [EposService]
})
export class EposModule {}
