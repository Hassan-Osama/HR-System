import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClockOutDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Employee ID' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: '2024-01-15T17:00:00Z', description: 'Clock-out time', required: false })
  @IsDateString()
  @IsOptional()
  time?: string;

  @ApiProperty({ example: 'Office entrance', description: 'Location of clock-out', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
