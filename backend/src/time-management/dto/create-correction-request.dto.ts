import { IsString, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RequestedPunchDto {
  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT'], description: 'Type of punch' })
  @IsEnum(['IN', 'OUT'])
  type: 'IN' | 'OUT';

  @ApiProperty({ example: '2024-01-15T09:00:00Z', description: 'Requested time' })
  @IsDateString()
  time: string;
}

export class CreateCorrectionRequestDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Employee ID requesting correction' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Attendance record ID to correct', required: false })
  @IsString()
  @IsOptional()
  attendanceRecordId?: string;

  @ApiProperty({ example: '2024-01-15', description: 'Date for the correction request' })
  @IsDateString()
  date: string;

  @ApiProperty({ 
    type: [RequestedPunchDto], 
    description: 'Requested punches',
    example: [{ type: 'IN', time: '2024-01-15T09:00:00Z' }, { type: 'OUT', time: '2024-01-15T17:00:00Z' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestedPunchDto)
  requestedPunches: RequestedPunchDto[];

  @ApiProperty({ example: 'Forgot to punch out due to emergency', description: 'Reason for correction request' })
  @IsString()
  reason: string;
}
