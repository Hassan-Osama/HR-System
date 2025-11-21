
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export type terminationAndResignationBenefitsDocument = HydratedDocument<terminationAndResignationBenefits>

@Schema({ timestamps: true })
export class terminationAndResignationBenefits {
    @Prop({ required: true, unique: true })
    name: string; // termination/resignation name like:  End of Service Gratuity.
    @Prop({ required: true, min: 0 })
    amount: number;
    @Prop()
    terms?: string;
    @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
    status: ConfigStatus;// draft, approved, rejected

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    createdBy?: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    approvedBy?: mongoose.Types.ObjectId;
    @Prop({})
    approvedAt?: Date



}

export const terminationAndResignationBenefitsSchema = SchemaFactory.createForClass(terminationAndResignationBenefits);
