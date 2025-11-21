import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { RefundStatus } from '../enums/payroll-tracking-enum';

export type refundsDocument = HydratedDocument<refunds>

@Schema({ timestamps: true })
export class refundDetails {
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    amount: number;
}
export const refundDetailsSchema = SchemaFactory.createForClass(refundDetails);

@Schema({ timestamps: true })
export class refunds {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'claims'})
    claimId?: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'disputes' })
    disputeId?: mongoose.Types.ObjectId;

    @Prop({ type: refundDetailsSchema, required: true })
    refundDetails: refundDetails;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name, required: true })
    employeeId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    financeStaffId: mongoose.Types.ObjectId;


    @Prop({ required: true, type: String, enum: RefundStatus, default: RefundStatus.PENDING })
    status: RefundStatus;// pending, paid
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'payrollRuns'})
    paidInPayrollRunId?: mongoose.Types.ObjectId; // the run that actually paid the refund

}

export const refundsSchema = SchemaFactory.createForClass(refunds);
