import mongoose from 'mongoose';
import { LeaveCategorySchema } from './models/leave-category.schema';
import { LeaveTypeSchema } from './models/leave-type.schema';
import { LeavePolicySchema } from './models/leave-policy.schema';
import { LeaveEntitlementSchema } from './models/leave-entitlement.schema';
import { LeaveRequestSchema } from './models/leave-request.schema';
import { AttachmentType } from './enums/attachment-type.enum';
import { AccrualMethod } from './enums/accrual-method.enum';
import { RoundingRule } from './enums/rounding-rule.enum';
import { LeaveStatus } from './enums/leave-status.enum';

export async function seedLeaves(connection: mongoose.Connection, employees: any) {
  const LeaveCategoryModel = connection.model('LeaveCategory', LeaveCategorySchema);
  const LeaveTypeModel = connection.model('LeaveType', LeaveTypeSchema);
  const LeavePolicyModel = connection.model('LeavePolicy', LeavePolicySchema);
  const LeaveEntitlementModel = connection.model('LeaveEntitlement', LeaveEntitlementSchema);
  const LeaveRequestModel = connection.model('LeaveRequest', LeaveRequestSchema);

  console.log('Clearing Leaves Data...');
  await LeaveCategoryModel.deleteMany({});
  await LeaveTypeModel.deleteMany({});
  await LeavePolicyModel.deleteMany({});
  await LeaveEntitlementModel.deleteMany({});
  await LeaveRequestModel.deleteMany({});

  console.log('Seeding Leave Categories...');
  const annualCategory = await LeaveCategoryModel.create({
    name: 'Annual',
    description: 'Standard annual leave',
  });

  const sickCategory = await LeaveCategoryModel.create({
    name: 'Sick',
    description: 'Medical leave',
  });
  console.log('Leave Categories seeded.');

  console.log('Seeding Leave Types...');
  const annualLeave = await LeaveTypeModel.create({
    code: 'AL',
    name: 'Annual Leave',
    categoryId: annualCategory._id,
    description: 'Paid annual leave',
    paid: true,
    deductible: true,
    requiresAttachment: false,
  });

  const sickLeave = await LeaveTypeModel.create({
    code: 'SL',
    name: 'Sick Leave',
    categoryId: sickCategory._id,
    description: 'Paid sick leave',
    paid: true,
    deductible: true,
    requiresAttachment: true,
    attachmentType: AttachmentType.MEDICAL,
  });
  console.log('Leave Types seeded.');

  console.log('Seeding Leave Policies...');
  await LeavePolicyModel.create({
    leaveTypeId: annualLeave._id,
    accrualMethod: AccrualMethod.MONTHLY,
    monthlyRate: 1.75, // 21 days / 12
    yearlyRate: 21,
    carryForwardAllowed: true,
    maxCarryForward: 5,
    roundingRule: RoundingRule.ROUND_UP,
    minNoticeDays: 7,
    eligibility: {
      minTenureMonths: 6,
    },
  });

  await LeavePolicyModel.create({
    leaveTypeId: sickLeave._id,
    accrualMethod: AccrualMethod.YEARLY,
    yearlyRate: 14,
    carryForwardAllowed: false,
    roundingRule: RoundingRule.NONE,
    minNoticeDays: 0,
    eligibility: {},
  });
  console.log('Leave Policies seeded.');

  console.log('Seeding Leave Entitlements...');
  // Give Alice some entitlements
  await LeaveEntitlementModel.create({
    employeeId: employees.alice._id,
    leaveTypeId: annualLeave._id,
    yearlyEntitlement: 21,
    accruedActual: 21,
    accruedRounded: 21,
    remaining: 21,
  });

  await LeaveEntitlementModel.create({
    employeeId: employees.alice._id,
    leaveTypeId: sickLeave._id,
    yearlyEntitlement: 14,
    accruedActual: 14,
    accruedRounded: 14,
    remaining: 14,
  });
  console.log('Leave Entitlements seeded.');

  console.log('Seeding Leave Requests...');
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekEnd = new Date(nextWeek);
  nextWeekEnd.setDate(nextWeek.getDate() + 2);

  await LeaveRequestModel.create({
    employeeId: employees.alice._id,
    leaveTypeId: annualLeave._id,
    dates: { from: nextWeek, to: nextWeekEnd },
    durationDays: 3,
    justification: 'Vacation',
    status: LeaveStatus.PENDING,
    approvalFlow: [
      {
        role: 'Manager',
        status: 'Pending',
      },
    ],
  });
  console.log('Leave Requests seeded.');

  return {
    categories: { annualCategory, sickCategory },
    types: { annualLeave, sickLeave },
  };
}
