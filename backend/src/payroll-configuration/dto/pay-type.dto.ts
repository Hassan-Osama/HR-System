import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export class CreatePayTypeDto {
  @IsString()
  type: string; // "Monthly", "Hourly", etc.

  @IsNumber()
  @Min(0)
  amount: number;
}

export class UpdatePayTypeDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsEnum(ConfigStatus)
  status?: ConfigStatus;
}
