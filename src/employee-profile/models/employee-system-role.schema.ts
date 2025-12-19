import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SystemRole } from '../enums/employee-profile.enums';

export type EmployeeSystemRoleDocument = HydratedDocument<EmployeeSystemRole>;

@Schema({ collection: 'employee_system_roles', timestamps: true })
export class EmployeeSystemRole {
  @Prop({
    type: Types.ObjectId,
    ref: 'EmployeeProfile',
    required: true,
    index: true,
  })
  employeeProfileId: Types.ObjectId;

  @Prop({
    type: [String],
    enum: Object.values(SystemRole),
    default: [],
  })
  roles: SystemRole[];

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const EmployeeSystemRoleSchema =
  SchemaFactory.createForClass(EmployeeSystemRole);
