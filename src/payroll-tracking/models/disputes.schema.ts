
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { DisputeStatus } from '../enums/payroll-tracking-enum';

export type disputesDocument = HydratedDocument<disputes>



@Schema({ timestamps: true })
export class disputes {
    @Prop({ required: true, unique: true })
    disputeId: string; // for frontend view purposes ex: DISP-0001

    @Prop({ required: true })
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name, required: true })
    employeeId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    financeStaffId?: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'paySlip', required: true })
    payslipId: mongoose.Types.ObjectId;

    @Prop({ required: true, type: String, enum: DisputeStatus, default: DisputeStatus.UNDER_REVIEW })
    status: DisputeStatus;// under review, approved, rejected

    @Prop()
    rejectionReason?: string;

    @Prop()
    resolutionComment?: string;
}

export const disputesSchema = SchemaFactory.createForClass(disputes);
