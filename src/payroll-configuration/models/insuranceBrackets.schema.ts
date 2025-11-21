
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export type insuranceBracketsDocument = HydratedDocument<insuranceBrackets>

@Schema({ timestamps: true })
export class insuranceBrackets {
  @Prop({ required: true, unique: true })
  name: string; // insurance name like: social, health insurance
  @Prop({ required: true, min: 0 })
  amount: number;
  @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
  status: ConfigStatus;// draft, approved, rejected
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  createdBy?: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  approvedBy?: mongoose.Types.ObjectId;
  @Prop({})
  approvedAt?: Date

  @Prop({ required: true })
  minSalary: number;

  @Prop({ required: true })
  maxSalary: number;

  @Prop({ required: true,min:0,max:100 })
  employeeRate: number;    // percentage

  @Prop({ required: true ,min:0,max:100})
  employerRate: number;    // percentage

}

export const insuranceBracketsSchema = SchemaFactory.createForClass(insuranceBrackets);