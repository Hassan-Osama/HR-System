
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { PayRollPaymentStatus, PayRollStatus } from '../enums/payroll-execution-enum';


export type payrollRunsDocument = HydratedDocument<payrollRuns>

@Schema({ timestamps: true })
export class payrollRuns {
  @Prop({ required: true, unique: true })
  runId: string;//for viewing purposes ex: PR-2025-0001
  @Prop({ required: true })
  payrollPeriod: Date; // end of each month like 31-01-2025
  @Prop({ required: true, type: String, enum: PayRollStatus ,default:PayRollStatus.DRAFT})
  status: PayRollStatus;

  @Prop({ required: true })
  entity: string; // name of the company

  @Prop({ required: true })
  employees: number;
  @Prop({ required: true })
  exceptions: number;
  @Prop({ required: true })
  totalnetpay: number;

  
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  payrollSpecialistId: mongoose.Schema.Types.ObjectId;// createdBy

  @Prop({ required: true, type: String, enum: PayRollPaymentStatus, default: PayRollPaymentStatus.PENDING })
  paymentStatus: PayRollPaymentStatus;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  payrollManagerId?: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  financeStaffId?: mongoose.Schema.Types.ObjectId;

  @Prop()
  rejectionReason?: string;

  @Prop()
  unlockReason?: string;

  @Prop()
  managerApprovalDate?: Date;

  @Prop()
  financeApprovalDate?: Date;
}



export const payrollRunsSchema = SchemaFactory.createForClass(payrollRuns);





