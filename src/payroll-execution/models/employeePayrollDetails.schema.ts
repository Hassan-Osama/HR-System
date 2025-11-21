
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { payrollRuns } from './payrollRuns.schema';
import { BankStatus } from '../enums/payroll-execution-enum';

export type employeePayrollDetailsDocument = HydratedDocument<employeePayrollDetails>


@Schema({ timestamps: true })
export class employeePayrollDetails {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name, required: true })
    employeeId: mongoose.Types.ObjectId;
    @Prop({ required: true })
    baseSalary: number;
    @Prop({ required: true })
    allowances: number;
    @Prop({ required: true })
    deductions: number;//including penalties
    @Prop({ required: true })
    netSalary: number;
    @Prop({ required: true })
    netPay: number;// after all decuctions and refunds final amount to be paid
    @Prop({ required: true, enum: BankStatus, type: String })
    bankStatus: BankStatus;// valid, missing
    @Prop({ type: String })
    exceptions?: string;// flags if any issues while calculating payroll for this employee or missing bank details
    @Prop({})
    bonus?: number;
    @Prop({})
    benefit?: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: payrollRuns.name, required: true })
    payrollRunId: mongoose.Types.ObjectId;

}



export const employeePayrollDetailsSchema = SchemaFactory.createForClass(employeePayrollDetails);