// src/payroll-configuration/dto/payroll-policy.dto.ts
import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max, IsDateString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyType, Applicability } from '../enums/payroll-configuration-enums';

class RuleDefinitionDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  thresholdAmount: number;
}

export class CreatePayrollPolicyDto {
  @IsString()
  policyName: string;

  @IsString()
  policyType: PolicyType;

  @IsString()
  description: string;

  @IsDateString()
  effectiveDate: string;

  @IsString()
  applicability: Applicability;

  @ValidateNested()
  @Type(() => RuleDefinitionDto)
  @IsObject()
  ruleDefinition: RuleDefinitionDto;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdatePayrollPolicyDto {
  @IsOptional()
  @IsString()
  policyName?: string;

  @IsOptional()
  @IsString()
  policyType?: PolicyType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsString()
  applicability?: Applicability;

  @IsOptional()
  @ValidateNested()
  @Type(() => RuleDefinitionDto)
  @IsObject()
  ruleDefinition?: RuleDefinitionDto;
}
