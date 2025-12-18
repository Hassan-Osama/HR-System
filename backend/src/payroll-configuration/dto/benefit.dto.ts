// src/payroll-configuration/dto/benefit.dto.ts
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBenefitDto {
  @IsString()
  name: string; // termination / resignation benefit name

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateBenefitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  terms?: string;
}
