// src/payroll-configuration/dto/insurance-bracket.dto.ts
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateInsuranceBracketDto {
  @IsString()
  name: string; // "Social Insurance", etc.

  @IsNumber()
  @Min(0)
  minSalary: number;

  @IsNumber()
  @Min(0)
  maxSalary: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  employeeRate: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  employerRate: number;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateInsuranceBracketDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  employeeRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  employerRate?: number;
}
