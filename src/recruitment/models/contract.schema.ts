import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Contract {
  @Prop({ type: Types.ObjectId, ref: 'Offer', required: true })
  offerId: Types.ObjectId;

  @Prop()
  acceptanceDate: Date;

  // FINAL ACCEPTED COMPENSATION
  @Prop({ required: true })
  grossSalary: number;

  @Prop()
  signingBonus?: number;

  @Prop()
  role: string;

  @Prop()
  benefits?: [string];

  @Prop({ type: Types.ObjectId, ref: 'Document' })
  documentId: Types.ObjectId;

  // SIGNATURES
  @Prop()
  employeeSignatureUrl?: string;

  @Prop()
  employerSignatureUrl?: string;

  @Prop()
  employeeSignedAt?: Date;

  @Prop()
  employerSignedAt?: Date;
}

export type ContractDocument = HydratedDocument<Contract>;
export const ContractSchema = SchemaFactory.createForClass(Contract);
