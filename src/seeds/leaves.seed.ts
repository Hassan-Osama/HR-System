import mongoose from 'mongoose';
import { LeaveCategorySchema } from '../leaves/models/leave-category.schema';
import { LeaveTypeSchema } from '../leaves/models/leave-type.schema';
import { LeavePolicySchema } from '../leaves/models/leave-policy.schema';
import { LeaveEntitlementSchema } from '../leaves/models/leave-entitlement.schema';
import { LeaveRequestSchema } from '../leaves/models/leave-request.schema';
import { AttachmentSchema } from '../leaves/models/attachment.schema';
import { CalendarSchema } from '../leaves/models/calendar.schema';
import { LeaveAdjustmentSchema } from '../leaves/models/leave-adjustment.schema';
import { HolidaySchema } from '../time-management/models/holiday.schema';
import { AttachmentType } from '../leaves/enums/attachment-type.enum';
import { AccrualMethod } from '../leaves/enums/accrual-method.enum';
import { RoundingRule } from '../leaves/enums/rounding-rule.enum';
import { LeaveStatus } from '../leaves/enums/leave-status.enum';
import { AdjustmentType } from '../leaves/enums/adjustment-type.enum';

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = {
  alice: SeedRef;
  bob: SeedRef;
  charlie: SeedRef;
  tariq: SeedRef;
  laila: SeedRef;
  amir: SeedRef;
  salma: SeedRef;
};

export async function seedLeaves(
  connection: mongoose.Connection,
  employees: SeedEmployees,
) {
  const LeaveCategoryModel = connection.model(
    'LeaveCategory',
    LeaveCategorySchema,
  );
  const LeaveTypeModel = connection.model('LeaveType', LeaveTypeSchema);
  const LeavePolicyModel = connection.model('LeavePolicy', LeavePolicySchema);
  const LeaveEntitlementModel = connection.model(
    'LeaveEntitlement',
    LeaveEntitlementSchema,
  );
  const LeaveRequestModel = connection.model(
    'LeaveRequest',
    LeaveRequestSchema,
  );
  const AttachmentModel = connection.model('Attachment', AttachmentSchema);
  const CalendarModel = connection.model('Calendar', CalendarSchema);
  const LeaveAdjustmentModel = connection.model(
    'LeaveAdjustment',
    LeaveAdjustmentSchema,
  );
  const HolidayModel = connection.model('Holiday', HolidaySchema);

  console.log('Clearing Leaves Data...');
  await LeaveCategoryModel.deleteMany({});
  await LeaveTypeModel.deleteMany({});
  await LeavePolicyModel.deleteMany({});
  await LeaveEntitlementModel.deleteMany({});
  await LeaveRequestModel.deleteMany({});
  await AttachmentModel.deleteMany({});
  await CalendarModel.deleteMany({});
  await LeaveAdjustmentModel.deleteMany({});

  console.log('Seeding Leave Categories...');
  const annualCategory = await LeaveCategoryModel.create({
    name: 'Annual',
    description: 'Standard annual leave',
  });

  const sickCategory = await LeaveCategoryModel.create({
    name: 'Sick',
    description: 'Medical leave',
  });

  const unpaidCategory = await LeaveCategoryModel.create({
    name: 'Unpaid',
    description: 'Unpaid leave category',
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

  const unpaidLeave = await LeaveTypeModel.create({
    code: 'UL',
    name: 'Unpaid Leave',
    categoryId: unpaidCategory._id,
    description: 'Unpaid leave type',
    paid: false,
    deductible: false,
    requiresAttachment: false,
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

  const medicalCertificate = await AttachmentModel.create({
    originalName: 'medical-report.pdf',
    filePath: '/attachments/medical-report.pdf',
    fileType: 'application/pdf',
    size: 350000,
  });

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

  await LeaveRequestModel.create({
    employeeId: employees.bob._id,
    leaveTypeId: sickLeave._id,
    dates: { from: today, to: nextWeek },
    durationDays: 7,
    justification: 'Medical leave',
    attachmentId: medicalCertificate._id,
    status: LeaveStatus.APPROVED,
    approvalFlow: [
      {
        role: 'HR',
        status: 'Approved',
        decidedBy: employees.alice._id,
        decidedAt: new Date(),
      },
    ],
  });

  // TA (Tariq) - 4 rejected, 1 approved
  await LeaveRequestModel.create([
    {
      employeeId: employees.tariq._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-05-01'), to: new Date('2025-05-02') },
      durationDays: 2,
      justification: 'Workshop support travel',
      status: LeaveStatus.REJECTED,
      approvalFlow: [
        { role: 'Manager', status: 'Rejected', decidedBy: employees.alice._id, decidedAt: new Date('2025-04-20') },
      ],
    },
    {
      employeeId: employees.tariq._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-06-10'), to: new Date('2025-06-10') },
      durationDays: 1,
      justification: 'Training conflict',
      status: LeaveStatus.REJECTED,
      approvalFlow: [
        { role: 'Manager', status: 'Rejected', decidedBy: employees.alice._id, decidedAt: new Date('2025-06-05') },
      ],
    },
    {
      employeeId: employees.tariq._id,
      leaveTypeId: sickLeave._id,
      dates: { from: new Date('2025-07-15'), to: new Date('2025-07-16') },
      durationDays: 2,
      justification: 'Medical checkup',
      status: LeaveStatus.REJECTED,
      approvalFlow: [
        { role: 'HR', status: 'Rejected', decidedBy: employees.bob._id, decidedAt: new Date('2025-07-10') },
      ],
    },
    {
      employeeId: employees.tariq._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-08-20'), to: new Date('2025-08-22') },
      durationDays: 3,
      justification: 'Family event',
      status: LeaveStatus.REJECTED,
      approvalFlow: [
        { role: 'Manager', status: 'Rejected', decidedBy: employees.alice._id, decidedAt: new Date('2025-08-15') },
      ],
    },
    {
      employeeId: employees.tariq._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-09-05'), to: new Date('2025-09-06') },
      durationDays: 2,
      justification: 'Professional certification prep',
      status: LeaveStatus.APPROVED,
      approvalFlow: [
        { role: 'Manager', status: 'Approved', decidedBy: employees.alice._id, decidedAt: new Date('2025-08-30') },
      ],
    },
  ]);

  // LA (Laila) - 3 approved
  await LeaveRequestModel.create([
    {
      employeeId: employees.laila._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-05-12'), to: new Date('2025-05-13') },
      durationDays: 2,
      justification: 'Conference attendance',
      status: LeaveStatus.APPROVED,
      approvalFlow: [
        { role: 'Manager', status: 'Approved', decidedBy: employees.alice._id, decidedAt: new Date('2025-05-05') },
      ],
    },
    {
      employeeId: employees.laila._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-06-18'), to: new Date('2025-06-19') },
      durationDays: 2,
      justification: 'Family visit',
      status: LeaveStatus.APPROVED,
      approvalFlow: [
        { role: 'Manager', status: 'Approved', decidedBy: employees.alice._id, decidedAt: new Date('2025-06-10') },
      ],
    },
    {
      employeeId: employees.laila._id,
      leaveTypeId: sickLeave._id,
      dates: { from: new Date('2025-07-08'), to: new Date('2025-07-09') },
      durationDays: 2,
      justification: 'Dental procedure recovery',
      status: LeaveStatus.APPROVED,
      approvalFlow: [
        { role: 'HR', status: 'Approved', decidedBy: employees.bob._id, decidedAt: new Date('2025-07-05') },
      ],
    },
  ]);

  // Accountant (Amir) - 2 pending, 1 approved, 1 rejected
  await LeaveRequestModel.create([
    {
      employeeId: employees.amir._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-05-22'), to: new Date('2025-05-23') },
      durationDays: 2,
      justification: 'Quarter-end break',
      status: LeaveStatus.PENDING,
      approvalFlow: [
        { role: 'Manager', status: 'Pending' },
      ],
    },
    {
      employeeId: employees.amir._id,
      leaveTypeId: sickLeave._id,
      dates: { from: new Date('2025-06-02'), to: new Date('2025-06-02') },
      durationDays: 1,
      justification: 'Clinic visit',
      status: LeaveStatus.PENDING,
      approvalFlow: [
        { role: 'HR', status: 'Pending' },
      ],
    },
    {
      employeeId: employees.amir._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-07-20'), to: new Date('2025-07-22') },
      durationDays: 3,
      justification: 'Family vacation',
      status: LeaveStatus.APPROVED,
      approvalFlow: [
        { role: 'Manager', status: 'Approved', decidedBy: employees.alice._id, decidedAt: new Date('2025-07-10') },
      ],
    },
    {
      employeeId: employees.amir._id,
      leaveTypeId: annualLeave._id,
      dates: { from: new Date('2025-08-12'), to: new Date('2025-08-13') },
      durationDays: 2,
      justification: 'Audit support conflict',
      status: LeaveStatus.REJECTED,
      approvalFlow: [
        { role: 'Manager', status: 'Rejected', decidedBy: employees.alice._id, decidedAt: new Date('2025-08-05') },
      ],
    },
  ]);

  // Librarian (Salma) - unpaid approved leave
  await LeaveRequestModel.create({
    employeeId: employees.salma._id,
    leaveTypeId: unpaidLeave._id,
    dates: { from: new Date('2025-09-15'), to: new Date('2025-09-17') },
    durationDays: 3,
    justification: 'Community event support (unpaid)',
    status: LeaveStatus.APPROVED,
    approvalFlow: [
      { role: 'Manager', status: 'Approved', decidedBy: employees.alice._id, decidedAt: new Date('2025-09-05') },
    ],
  });
  console.log('Leave Requests seeded.');

  console.log('Seeding Leave Calendar...');
  const holidays = await HolidayModel.find({}).select({ _id: 1, startDate: 1 }).lean();
  const holidaysByYear = holidays.reduce<Record<number, mongoose.Types.ObjectId[]>>(
    (acc, h) => {
      if (!h.startDate) return acc;
      const year = new Date(h.startDate).getFullYear();
      acc[year] = acc[year] || [];
      acc[year].push(h._id as mongoose.Types.ObjectId);
      return acc;
    },
    {},
  );

  const calendarYear = new Date().getFullYear();
  const holidayIdsForYear = holidaysByYear[calendarYear] || [];

  await CalendarModel.updateOne(
    { year: calendarYear },
    {
      $set: {
        year: calendarYear,
        holidays: holidayIdsForYear,
        blockedPeriods: [
          {
            from: new Date('2025-08-01'),
            to: new Date('2025-08-15'),
            reason: 'Peak season blackout',
          },
        ],
      },
    },
    { upsert: true },
  );

  console.log('Seeding Leave Adjustments...');
  await LeaveAdjustmentModel.create({
    employeeId: employees.charlie._id,
    leaveTypeId: annualLeave._id,
    adjustmentType: AdjustmentType.ADD,
    amount: 2,
    reason: 'Recognition award',
    hrUserId: employees.alice._id,
  });

  return {
    categories: { annualCategory, sickCategory, unpaidCategory },
    types: { annualLeave, sickLeave, unpaidLeave },
  };
}
