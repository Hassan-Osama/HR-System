
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { ConfigStatus } from '../enums/payroll-configuration-enums';
export type allowanceDocument = HydratedDocument<allowance>




@Schema({ timestamps: true })
export class allowance {
    @Prop({ required: true })
    name: string; // allowance name like:  Housing Allowance, Transport Allowance
    @Prop({ required: true, min: 0 })
    amount: number;
   @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
    status: ConfigStatus;// draft, approved, rejected

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    createdBy?: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    approvedBy?: mongoose.Types.ObjectId;
    @Prop({})
    approvedAt?: Date


}

export const allowanceSchema = SchemaFactory.createForClass(allowance);
