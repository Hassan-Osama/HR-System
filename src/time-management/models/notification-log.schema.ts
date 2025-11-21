import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationLogDocument = HydratedDocument<NotificationLog>;

@Schema({ timestamps: true })
export class NotificationLog {
    @Prop({type: Types.ObjectId, ref: 'EmployeeProfile', required: true})
    to: Types.ObjectId;

    @Prop({ required: true })
    type: string;

    @Prop()
    message?: string;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
