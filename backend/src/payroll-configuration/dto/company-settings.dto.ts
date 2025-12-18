// src/payroll-configuration/dto/company-settings.dto.ts
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsOptional()
  @IsDateString()
  payDate?: string; // stored as Date in schema

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
