import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EmployeeProfile as Employee } from '../../employee-profile/models/employee-profile.schema';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export type taxRulesDocument = HydratedDocument<taxRules>;

@Schema({ timestamps: true })
export class taxRules {
  /* ==========================
   *        BASIC INFO
   * ========================== */

  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  /* ==========================
   *        TAX BRACKETS
   * ========================== */

  @Prop({ required: true, min: 0 })
  bracketFrom: number;

  /**
   * 0 = no upper limit
   */
  @Prop({ required: true, min: 0 })
  bracketTo: number;

  /* ==========================
   *        TAX RATE
   * ========================== */

  @Prop({ required: true, min: 0 })
  rate: number; // percentage (e.g. 10 = 10%)

  /* ==========================
   *        STATUS FLOW
   * ========================== */

  @Prop({
    required: true,
    type: String,
    enum: ConfigStatus,
    default: ConfigStatus.DRAFT,
  })
  status: ConfigStatus;

  /* ==========================
   *        AUDIT FIELDS
   * ========================== */

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  createdBy?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
  approvedBy?: mongoose.Types.ObjectId;

  @Prop()
  approvedAt?: Date;
}

export const taxRulesSchema = SchemaFactory.createForClass(taxRules);
