import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetReportDto {
    @ApiProperty({ example: '2025-01-01', description: 'Start date for the report (YYYY-MM-DD)' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2025-01-31', description: 'End date for the report (YYYY-MM-DD)' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Optional employee ID to filter by', required: false })
    @IsString()
    @IsOptional()
    employeeId?: string;

    @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Optional department ID to filter by', required: false })
    @IsString()
    @IsOptional()
    departmentId?: string;

    @ApiProperty({ example: 'FULL_TIME', description: 'Optional employee type/contract type to filter by (FULL_TIME, PART_TIME, CONTRACT, INTERN, PROBATION)', required: false })
    @IsString()
    @IsOptional()
    employeeType?: string;
}
