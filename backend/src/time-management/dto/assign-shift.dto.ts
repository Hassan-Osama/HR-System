import { IsString, IsMongoId, IsDateString, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ShiftAssignmentStatus } from '../models/enums';

export class AssignShiftDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Employee ID (for individual assignment)', required: false })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => !o.departmentId && !o.positionId)
  employeeId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Department ID (for department-wide assignment)', required: false })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => !o.employeeId && !o.positionId)
  departmentId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', description: 'Position ID (for position-based assignment)', required: false })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => !o.employeeId && !o.departmentId)
  positionId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439014', description: 'Shift ID to assign' })
  @IsMongoId()
  shiftId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439015', description: 'Schedule Rule ID', required: false })
  @IsMongoId()
  @IsOptional()
  scheduleRuleId?: string;

  @ApiProperty({ example: '2025-12-10T00:00:00Z', description: 'Start date of the shift assignment' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-31T00:00:00Z', description: 'End date of the shift assignment (null means ongoing)', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ enum: ShiftAssignmentStatus, example: ShiftAssignmentStatus.PENDING, description: 'Status of the shift assignment', required: false })
  @IsEnum(ShiftAssignmentStatus)
  @IsOptional()
  status?: ShiftAssignmentStatus;
}
