import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTaxRuleDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bracketFrom: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bracketTo: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTaxRuleDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  bracketFrom?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  bracketTo?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
