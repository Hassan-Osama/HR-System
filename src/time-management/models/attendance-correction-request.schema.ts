import { Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AttendanceRecord, Punch } from "./attendance-record.schema";
import { HydratedDocument } from "mongoose";
import { CorrectionRequestStatus } from "./enums/index";

export type AttendanceCorrectionRequestDocument = HydratedDocument<AttendanceCorrectionRequest>;

@Schema()
export class AttendanceCorrectionRequest{
    @Prop({type: Types.ObjectId, ref: 'EmployeeProfile', required: true})
    employeeId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'AttendanceRecord', required: true})
    attendanceRecord: AttendanceRecord;

    @Prop()
    reason?: string;

    @Prop({ enum: CorrectionRequestStatus, default: CorrectionRequestStatus.SUBMITTED })
    status: CorrectionRequestStatus;
}

export const AttendanceCorrectionRequestSchema = SchemaFactory.createForClass(AttendanceCorrectionRequest);
