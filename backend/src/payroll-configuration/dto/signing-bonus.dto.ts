// src/payroll-configuration/dto/signing-bonus.dto.ts
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSigningBonusDto {
  @IsString()
  positionName: string; // e.g. Junior TA, Senior TA

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  createdBy?: string; // employee id (if you use it later)
}

export class UpdateSigningBonusDto {
  @IsOptional()
  @IsString()
  positionName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}
