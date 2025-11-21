import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyWideSettingsDocument=HydratedDocument<CompanyWideSettings>

@Schema({timestamps: true})
export class CompanyWideSettings {
    @Prop({ required: true, })
    payDate: Date; 
    @Prop({ required: true,})
    timeZone: string;
    @Prop({ required: true, default:'EGP' })
    currency: string; //will allow only egp
}

export const CompanyWideSettingsSchema = SchemaFactory.createForClass(CompanyWideSettings);