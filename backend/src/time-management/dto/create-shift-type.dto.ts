import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftTypeDto {
  @ApiProperty({ example: 'Normal Shift', description: 'Name of the shift type' })
  @IsString()
  name: string;

  @ApiProperty({ example: true, description: 'Whether the shift type is active', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
