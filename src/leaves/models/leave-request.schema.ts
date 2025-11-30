import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LeaveStatus } from '../enums/leave-status.enum';

export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;

@Schema({ timestamps: true })
export class LeaveRequest {

  // EMPLOYEE REQUESTING THE LEAVE
  @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile', required: true })
  employeeId: Types.ObjectId;

  // LEAVE TYPE (annual, sick, maternity, etc.)
  @Prop({ type: Types.ObjectId, ref: 'LeaveType', required: true })
  leaveTypeId: Types.ObjectId;

  // DATE RANGE (from → to)
  @Prop({
    type: {
      from: Date,
      to: Date,
    },
    required: true,
  })
  dates: { from: Date; to: Date };

  // CALCULATED NET DURATION (excluding weekends/holidays)
  @Prop({ required: true })
  durationDays: number;

  // OPTIONAL JUSTIFICATION
  @Prop()
  justification?: string;

  // SUPPORTING DOCUMENT (MEDICAL CERTIFICATE, ETC.)
  @Prop({ type: Types.ObjectId, ref: 'Document' })
  attachmentId?: Types.ObjectId;

  // APPROVAL WORKFLOW HISTORY
  @Prop({
    type: [
      {
        role: String,
        status: String,
        decidedBy: { type: Types.ObjectId, ref: 'EmployeeProfile' },
        decidedAt: Date,
      },
    ],
    default: [],
  })
  approvalFlow: {
    role: string;
    status: string;
    decidedBy?: Types.ObjectId;
    decidedAt?: Date;
  }[];

  // OVERALL STATUS
  @Prop({
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  // FLAG IRREGULAR PATTERNS (OPTIONAL)
  @Prop({ default: false })
  irregularPatternFlag: boolean;
}

export const LeaveRequestSchema =
  SchemaFactory.createForClass(LeaveRequest);
