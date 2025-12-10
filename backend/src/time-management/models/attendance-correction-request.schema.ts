import { Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CorrectionRequestStatus, PunchType } from "./enums/index";

export type RequestedPunch = {
    type: PunchType;
    time: Date;
}

export type AttendanceCorrectionRequestDocument = HydratedDocument<AttendanceCorrectionRequest>;

@Schema({ timestamps: true })
export class AttendanceCorrectionRequest {
    @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile', required: true })
    employeeId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'AttendanceRecord' })
    attendanceRecordId?: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ default: [] })
    requestedPunches: RequestedPunch[];

    @Prop({ required: true })
    reason: string;

    @Prop({ enum: CorrectionRequestStatus, default: CorrectionRequestStatus.SUBMITTED })
    status: CorrectionRequestStatus;

    @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile' })
    reviewedBy?: Types.ObjectId;

    @Prop()
    reviewComment?: string;

    @Prop()
    reviewedAt?: Date;
}

export const AttendanceCorrectionRequestSchema = SchemaFactory.createForClass(AttendanceCorrectionRequest);
