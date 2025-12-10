import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShiftAssignmentStatus } from '../models/enums';

export class UpdateShiftStatusDto {
  @ApiProperty({ enum: ShiftAssignmentStatus, example: ShiftAssignmentStatus.APPROVED, description: 'New status for the shift assignment' })
  @IsEnum(ShiftAssignmentStatus)
  status: ShiftAssignmentStatus;
}
