import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EmployeeProfile as Employee } from '../../employee-profile/models/employee-profile.schema';

export type configBackupDocument = HydratedDocument<configBackup>;

@Schema({ timestamps: true })
export class configBackup {
  @Prop({ required: true })
  backupType: string; // e.g. "PAYROLL_CONFIGURATION"

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Employee.name, required: false })
  triggeredBy?: mongoose.Types.ObjectId; // admin who triggered backup (optional)

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  data: any; // snapshot of all config collections
}

export const configBackupSchema = SchemaFactory.createForClass(configBackup);
