// src/payroll-configuration/dto/allowance.dto.ts
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAllowanceDto {
  @IsString()
  name: string; // e.g. Housing Allowance

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  createdBy?: string; // employee id
}

export class UpdateAllowanceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}
