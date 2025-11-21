import { Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TimeExceptionType, TimeExceptionStatus } from "./enums/index";

export type TimeExceptionDocument = HydratedDocument<TimeException>;

@Schema()
export class TimeException{
    @Prop({type: Types.ObjectId, ref: 'EmployeeProfile', required: true})
    employeeId: Types.ObjectId;

    @Prop({enum: TimeExceptionType, required: true})
    type: TimeExceptionType;

    @Prop({type: Types.ObjectId, ref: 'AttendanceRecord', required: true})
    attendanceRecordId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'EmployeeProfile', required: true})
    assignedTo: Types.ObjectId; // person responsible for handling the exception

    @Prop({ enum: TimeExceptionStatus, default: TimeExceptionStatus.OPEN })
    status: TimeExceptionStatus;

    @Prop()
    reason?: string;
}

export const TimeExceptionSchema = SchemaFactory.createForClass(TimeException);
