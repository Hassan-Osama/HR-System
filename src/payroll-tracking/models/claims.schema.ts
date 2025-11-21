import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { ClaimStatus } from '../enums/payroll-tracking-enum';

export type claimsDocument = HydratedDocument<claims>

@Schema({ timestamps: true })
export class claims {
    @Prop({ required: true, unique: true })
    claimId: string; // for frontend view purposes ex: CLAIM-0001

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    claimType: string // for example: medical, etc

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name, required: true })
    employeeId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    financeStaffId?: mongoose.Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({})
    approvedAmountr?: number;

    @Prop({ required: true, type: String, enum: ClaimStatus, default: ClaimStatus.UNDER_REVIEW })
    status: ClaimStatus;// under review, approved, rejected

    @Prop()
    rejectionReason?: string;

    @Prop()
    resolutionComment?: string;

}

export const claimsSchema = SchemaFactory.createForClass(claims);