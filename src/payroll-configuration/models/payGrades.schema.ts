
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ConfigStatus } from '../enums/payroll-configuration-enums';

export type payGradeDocument = HydratedDocument<payGrade>

@Schema({ timestamps: true })
export class payGrade {
    @Prop({ required: true, unique: true })
    grade: string; // position garde and name like:  Junior TA, Mid TA, Senior TA
    @Prop({ required: true, min: 6000 })
    baseSalary: number
    @Prop({ required: true, min: 6000 })
    grossSalary: number;
    @Prop({ required: true, type: String, enum: ConfigStatus,default:ConfigStatus.DRAFT })
    status: ConfigStatus;// draft, approved, rejected

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' })
    createdBy?: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeProfile' })
    approvedBy?: mongoose.Types.ObjectId;
    @Prop({})
    approvedAt?: Date

}

export const payGradeSchema = SchemaFactory.createForClass(payGrade);