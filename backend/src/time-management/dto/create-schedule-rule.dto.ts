import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleRuleDto {
  @ApiProperty({ example: 'Flexible Hours', description: 'Name of the schedule rule' })
  @IsString()
  name: string;

  @ApiProperty({ example: '4 days on, 3 days off', description: 'Pattern description for the schedule rule' })
  @IsString()
  pattern: string;

  @ApiProperty({ example: true, description: 'Whether the schedule rule is active', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
