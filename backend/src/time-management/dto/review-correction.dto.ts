import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ReviewAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class ReviewCorrectionDto {
  @ApiProperty({ 
    example: 'APPROVE', 
    enum: ReviewAction,
    description: 'Review action: APPROVE or REJECT'
  })
  @IsEnum(ReviewAction)
  action: ReviewAction;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the reviewer' })
  @IsString()
  reviewedBy: string;

  @ApiProperty({ example: 'Approved based on security footage', description: 'Comment from reviewer', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
