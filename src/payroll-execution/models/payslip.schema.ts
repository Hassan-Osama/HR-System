import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { allowance, allowanceSchema } from '../../payroll-configuration/models/allowance.schema';
import { signingBonus, signingBonusSchema } from '../../payroll-configuration/models/signingBonus.schema';
import { terminationAndResignationBenefits, terminationAndResignationBenefitsSchema } from '../../payroll-configuration/models/terminationAndResignationBenefits';
import { taxRules, taxRulesSchema } from '../../payroll-configuration/models/taxRules.schema';
import { insuranceBrackets, insuranceBracketsSchema } from '../../payroll-configuration/models/insuranceBrackets.schema';
import { employeePenalties, employeePenaltiesSchema } from './employeePenalties.schema';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';
import { refundDetails, refundDetailsSchema } from '../../payroll-tracking/models/refunds.schema';
import { payrollRuns } from './payrollRuns.schema';
import { PaySlipPaymentStatus } from '../enums/payroll-execution-enum';



export type PayslipDocument = HydratedDocument<paySlip>

@Schema()
class Earnings {
    @Prop()
    baseSalary: number;

    @Prop({ type: [allowanceSchema] })
    allowances: allowance[]

    @Prop({ type: [signingBonusSchema] })
    bonuses?: signingBonus[]

    @Prop({ type: [terminationAndResignationBenefitsSchema] })
    benefits?: terminationAndResignationBenefits[]

    @Prop({ type: [refundDetailsSchema] })
    refunds?: refundDetails[]

}
const EarningsSchema = SchemaFactory.createForClass(Earnings)


@Schema()
class Deductions {
    @Prop({ type: [taxRulesSchema] })
    taxes: taxRules[]

    @Prop({ type: [insuranceBracketsSchema] })
    insurances?: insuranceBrackets[]

    @Prop({ type: employeePenaltiesSchema })
    penalties?: employeePenalties

}
const DeductionsSchema = SchemaFactory.createForClass(Deductions)


@Schema({ timestamps: true })
export class paySlip {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Employee.name })
    employeeId: mongoose.Types.ObjectId;
    @Prop({ type: mongoose.Schema.ObjectId, ref: payrollRuns.name, required: true })
    payrollRunId: mongoose.Types.ObjectId;
    @Prop({ type: EarningsSchema })
    earningsDetails: Earnings;
    @Prop({ type: DeductionsSchema })
    deductionsDetails: Deductions;
    @Prop({ required: true })
    totalGrossSalary: number
    @Prop({ required: true })
    totaDeductions?: number
    @Prop({ required: true })
    netPay: number
    @Prop({ type: String, enum: PaySlipPaymentStatus, default: PaySlipPaymentStatus.PENDING })
    paymentStatus: PaySlipPaymentStatus// in case we have bank integration in future
}

export const paySlipSchema = SchemaFactory.createForClass(paySlip);