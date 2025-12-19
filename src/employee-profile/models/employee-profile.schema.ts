import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ContractType,
  EmployeeStatus,
  WorkType,
} from '../enums/employee-profile.enums';
import { AppraisalRatingScaleType } from '../../performance/enums/performance.enums';
import { payGrade } from '../../payroll-configuration/models/payGrades.schema';
import { UserProfileBase } from './user-schema';

export type EmployeeProfileDocument = HydratedDocument<EmployeeProfile>;

@Schema({ collection: 'employee_profiles', timestamps: true })
export class EmployeeProfile extends UserProfileBase {
  // Core IDs
  @Prop({ type: String, required: true, unique: true })
  employeeNumber: string; // HR/Payroll number

  @Prop({ type: Date, required: true })
  dateOfHire: Date;

  @Prop({ type: String })
  workEmail?: string;

  @Prop({ type: String })
  biography?: string;

  @Prop({ type: Date })
  contractStartDate?: Date;

  @Prop({ type: Date })
  contractEndDate?: Date;

  // Banking details
  @Prop({ type: String })
  bankName?: string;

  @Prop({ type: String })
  bankAccountNumber?: string;

  @Prop({
    type: String,
    enum: Object.values(ContractType),
    required: false,
  })
  contractType?: ContractType;

  @Prop({
    type: String,
    enum: Object.values(WorkType),
    required: false,
  })
  workType?: WorkType;

  @Prop({
    type: String,
    enum: Object.values(EmployeeStatus),
    required: true,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus;

  @Prop({ type: Date, default: () => new Date() })
  statusEffectiveFrom?: Date;

  // Org Structure links
  @Prop({ type: Types.ObjectId, ref: 'Position' })
  primaryPositionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  primaryDepartmentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Position' })
  supervisorPositionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: payGrade.name })
  payGradeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppraisalRecord' })
  lastAppraisalRecordId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppraisalCycle' })
  lastAppraisalCycleId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppraisalTemplate' })
  lastAppraisalTemplateId?: Types.ObjectId;

  @Prop({ type: Date })
  lastAppraisalDate?: Date;

  @Prop({ type: Number })
  lastAppraisalScore?: number;

  @Prop({ type: String })
  lastAppraisalRatingLabel?: string;

  @Prop({
    type: String,
    enum: Object.values(AppraisalRatingScaleType),
  })
  lastAppraisalScaleType?: AppraisalRatingScaleType;

  @Prop({ type: String })
  lastDevelopmentPlanSummary?: string;
}

export const EmployeeProfileSchema =
  SchemaFactory.createForClass(EmployeeProfile);
