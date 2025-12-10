import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { PunchType } from "./enums/index";

export type Punch = {
    type: PunchType;
    time: Date;
    location?: string;
}

export type AttendanceRecordDocument = HydratedDocument<AttendanceRecord>;

@Schema({ timestamps: true })
export class AttendanceRecord {
    @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile', required: true })
    employeeId: Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ default: [] })
    punches: Punch[];

    @Prop({ default: 0 }) // to be computed after creating an instance
    totalWorkMinutes: number;

    @Prop({ default: false }) // to be computed after creating an instance
    hasMissedPunch: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'TimeException', default: [] })
    exceptionIds: Types.ObjectId[];

    @Prop({ default: true }) // should be set to false when there is an attendance correction request that is not yet resolved
    finalisedForPayroll: boolean;

    @Prop({ type: Types.ObjectId, ref: 'EmployeeProfile' })
    correctedBy?: Types.ObjectId;

    @Prop()
    correctionReason?: string;
}

export const AttendanceRecordSchema = SchemaFactory.createForClass(AttendanceRecord);
