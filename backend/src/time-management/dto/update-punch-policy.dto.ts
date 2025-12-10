import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PunchPolicyType {
  MULTIPLE = 'MULTIPLE',
  FIRST_LAST = 'FIRST_LAST',
}

export class UpdatePunchPolicyDto {
  @ApiProperty({ 
    example: 'MULTIPLE', 
    enum: PunchPolicyType,
    description: 'Punch policy: MULTIPLE allows multiple clock-ins/outs, FIRST_LAST only counts first in and last out'
  })
  @IsEnum(PunchPolicyType)
  policy: PunchPolicyType;
}
