// src/payroll-configuration/dto/pay-grade.dto.ts
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePayGradeDto {
  @IsString()
  grade: string; // "Junior TA", etc.

  @IsNumber()
  @Min(0)
  baseSalary: number;

  @IsNumber()
  @Min(0)
  grossSalary: number;

  @IsOptional()
  @IsString({ each: true })
  allowanceIds?: string[]; // list of Allowance _id

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdatePayGradeDto {
  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  grossSalary?: number;

  @IsOptional()
  @IsString({ each: true })
  allowanceIds?: string[];
}
