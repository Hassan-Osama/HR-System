import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { ShiftAssignmentStatus } from "./enums/index";

export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>;

@Schema()
export class ShiftAssignment{
    @Prop({type: Types.ObjectId, ref: 'EmployeeProfile'})
    employeeId?: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Department'})
    departmentId?: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Position'})
    positionId?: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Shift', required: true})
    shiftId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'ScheduleRule'})
    scheduleRuleId?: Types.ObjectId;

    @Prop({required: true})
    startDate: Date;

    @Prop()
    endDate?: Date; //null means ongoing

    @Prop({enum: ShiftAssignmentStatus, default: ShiftAssignmentStatus.PENDING})
    status: ShiftAssignmentStatus;
}

export const ShiftAssignmentSchema = SchemaFactory.createForClass(ShiftAssignment);
