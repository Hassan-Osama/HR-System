import { IsString, IsArray, IsOptional, ValidateNested, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PunchCorrectionDto {
  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT'], description: 'Type of punch' })
  @IsEnum(['IN', 'OUT'])
  type: 'IN' | 'OUT';

  @ApiProperty({ example: '2024-01-15T09:00:00Z', description: 'Corrected time' })
  @IsDateString()
  time: string;
}

export class ManualCorrectionDto {
  @ApiProperty({ 
    type: [PunchCorrectionDto], 
    description: 'Corrected punches array',
    example: [{ type: 'IN', time: '2024-01-15T09:00:00Z' }, { type: 'OUT', time: '2024-01-15T17:00:00Z' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PunchCorrectionDto)
  punches: PunchCorrectionDto[];

  @ApiProperty({ example: 'Employee forgot to punch out', description: 'Reason for correction' })
  @IsString()
  reason: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the manager making the correction' })
  @IsString()
  correctedBy: string;
}
