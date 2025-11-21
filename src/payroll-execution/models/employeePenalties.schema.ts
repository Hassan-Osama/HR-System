import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {  EmployeeProfile as Employee} from '../../employee-profile/models/employee-profile.schema';


export type penaltyDocument = HydratedDocument<penalty>

@Schema()
class penalty {
    @Prop({ required: true })
    reason: string
    @Prop({ required: true })
    amount: number
    
}
const penaltySchema = SchemaFactory.createForClass(penalty)

export type employeePenaltiesDocument = HydratedDocument<employeePenalties>

@Schema({ timestamps: true })
export class employeePenalties {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Employee.name})
    employeeId: mongoose.Types.ObjectId;
    @Prop({ type: [penaltySchema] })
    penalties?: penalty[]
}
export const employeePenaltiesSchema = SchemaFactory.createForClass(employeePenalties);
