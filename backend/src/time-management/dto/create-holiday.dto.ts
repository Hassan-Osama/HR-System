import { IsEnum, IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HolidayType } from '../models/enums';

export class CreateHolidayDto {
  @ApiProperty({ enum: HolidayType, example: HolidayType.NATIONAL, description: 'Type of holiday' })
  @IsEnum(HolidayType)
  type: HolidayType;

  @ApiProperty({ example: '2025-12-25T00:00:00Z', description: 'Start date of the holiday' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-26T00:00:00Z', description: 'End date of the holiday (optional, if missing startDate is used)', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'Christmas Day', description: 'Name of the holiday', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: true, description: 'Whether the holiday is active', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
