import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TerminationInitiation } from '../enums/termination-initiation.enum';
import { TerminationStatus } from '../enums/termination-status.enum';

@Schema({ timestamps: true })
export class TerminationRequest {

  @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile', required: true })
  employeeId: Types.ObjectId;

  @Prop({
    enum: TerminationInitiation,
    required: true
  })
  initiator: TerminationInitiation;

  @Prop({ required: true })
  reason: string;

  @Prop()
  employeeComments?: string;

  @Prop()
  hrComments?: string;

  @Prop({
    enum: TerminationStatus,
    default: TerminationStatus.PENDING
  })
  status: TerminationStatus;

  @Prop()
  terminationDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Contract', required: true })
  contractId: Types.ObjectId;
}

export type TerminationRequestDocument = HydratedDocument<TerminationRequest>;
export const TerminationRequestSchema = SchemaFactory.createForClass(TerminationRequest);
