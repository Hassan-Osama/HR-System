import mongoose from 'mongoose';
import { ShiftTypeSchema } from '../time-management/models/shift-type.schema';
import { ShiftSchema } from '../time-management/models/shift.schema';
import { HolidaySchema } from '../time-management/models/holiday.schema';
import { latenessRuleSchema } from '../time-management/models/lateness-rule.schema';
import { OvertimeRuleSchema } from '../time-management/models/overtime-rule.schema';
import { ScheduleRuleSchema } from '../time-management/models/schedule-rule.schema';
import { ShiftAssignmentSchema } from '../time-management/models/shift-assignment.schema';
import { AttendanceRecordSchema } from '../time-management/models/attendance-record.schema';
import { AttendanceCorrectionRequestSchema } from '../time-management/models/attendance-correction-request.schema';
import { NotificationLogSchema } from '../time-management/models/notification-log.schema';
import { TimeExceptionSchema } from '../time-management/models/time-exception.schema';
import {
  PunchPolicy,
  HolidayType,
  ShiftAssignmentStatus,
  PunchType,
  CorrectionRequestStatus,
  TimeExceptionType,
  TimeExceptionStatus,
} from '../time-management/models/enums/index';

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = { alice: SeedRef; bob: SeedRef };

export async function seedTimeManagement(
  connection: mongoose.Connection,
  employees: SeedEmployees,
  _departments?: unknown,
  _positions?: unknown,
) {
  void _departments;
  void _positions;

  const ShiftTypeModel = connection.model('ShiftType', ShiftTypeSchema);
  const ShiftModel = connection.model('Shift', ShiftSchema);
  const HolidayModel = connection.model('Holiday', HolidaySchema);
  const LatenessRuleModel = connection.model(
    'LatenessRule',
    latenessRuleSchema,
  );
  const OvertimeRuleModel = connection.model(
    'OvertimeRule',
    OvertimeRuleSchema,
  );
  const ScheduleRuleModel = connection.model(
    'ScheduleRule',
    ScheduleRuleSchema,
  );
  const ShiftAssignmentModel = connection.model(
    'ShiftAssignment',
    ShiftAssignmentSchema,
  );
  const AttendanceRecordModel = connection.model(
    'AttendanceRecord',
    AttendanceRecordSchema,
  );
  const AttendanceCorrectionRequestModel = connection.model(
    'AttendanceCorrectionRequest',
    AttendanceCorrectionRequestSchema,
  );
  const NotificationLogModel = connection.model(
    'NotificationLog',
    NotificationLogSchema,
  );
  const TimeExceptionModel = connection.model(
    'TimeException',
    TimeExceptionSchema,
  );

  console.log('Clearing Time Management...');
  await ShiftTypeModel.deleteMany({});
  await ShiftModel.deleteMany({});
  await HolidayModel.deleteMany({});
  await LatenessRuleModel.deleteMany({});
  await OvertimeRuleModel.deleteMany({});
  await ScheduleRuleModel.deleteMany({});
  await ShiftAssignmentModel.deleteMany({});
  await AttendanceRecordModel.deleteMany({});
  await AttendanceCorrectionRequestModel.deleteMany({});
  await NotificationLogModel.deleteMany({});
  await TimeExceptionModel.deleteMany({});

  console.log('Seeding Shift Types...');
  const morningShiftType = await ShiftTypeModel.create({
    name: 'Morning Shift',
    active: true,
  });

  const nightShiftType = await ShiftTypeModel.create({
    name: 'Night Shift',
    active: true,
  });
  console.log('Shift Types seeded.');

  console.log('Seeding Shifts...');
  const standardMorningShift = await ShiftModel.create({
    name: 'Standard Morning (9-5)',
    shiftType: morningShiftType._id,
    startTime: '09:00',
    endTime: '17:00',
    punchPolicy: PunchPolicy.FIRST_LAST,
    graceInMinutes: 15,
    graceOutMinutes: 15,
    requiresApprovalForOvertime: true,
    active: true,
  });

  const standardNightShift = await ShiftModel.create({
    name: 'Standard Night (10-6)',
    shiftType: nightShiftType._id,
    startTime: '22:00',
    endTime: '06:00',
    punchPolicy: PunchPolicy.FIRST_LAST,
    graceInMinutes: 15,
    graceOutMinutes: 15,
    requiresApprovalForOvertime: true,
    active: true,
  });
  console.log('Shifts seeded.');

  console.log('Seeding Holidays...');
  await HolidayModel.create({
    type: HolidayType.NATIONAL,
    startDate: new Date('2025-01-01'),
    name: 'New Year',
    active: true,
  });
  console.log('Holidays seeded.');

  console.log('Seeding Lateness Rules...');
  await LatenessRuleModel.create({
    name: 'Standard Lateness',
    gracePeriodMinutes: 15,
    deductionForEachMinute: 1,
    active: true,
  });
  console.log('Lateness Rules seeded.');

  console.log('Seeding Overtime Rules...');
  await OvertimeRuleModel.create({
    name: 'Standard Overtime',
    active: true,
    approved: true,
  });
  console.log('Overtime Rules seeded.');

  console.log('Seeding Schedule Rules...');
  await ScheduleRuleModel.create({
    name: 'Standard Week',
    pattern: 'Mon-Fri',
    active: true,
  });
  console.log('Schedule Rules seeded.');

  console.log('Seeding Shift Assignments...');
  if (employees && employees.bob) {
    await ShiftAssignmentModel.create({
      employeeId: employees.bob._id,
      shiftId: standardMorningShift._id,
      startDate: new Date('2025-01-01'),
      status: ShiftAssignmentStatus.APPROVED,
    });
  }
  console.log('Shift Assignments seeded.');

  console.log('Seeding attendance operations...');
  const attendanceRecord = await AttendanceRecordModel.create({
    employeeId: employees.bob._id,
    punches: [{ type: PunchType.IN, time: new Date('2025-01-05T09:02:00Z') }],
    totalWorkMinutes: 0,
    hasMissedPunch: true,
    finalisedForPayroll: false,
  });

  const timeException = await TimeExceptionModel.create({
    employeeId: employees.bob._id,
    type: TimeExceptionType.MISSED_PUNCH,
    attendanceRecordId: attendanceRecord._id,
    assignedTo: employees.alice._id,
    status: TimeExceptionStatus.OPEN,
    reason: 'Missing OUT punch on 6 Jan',
  });

  await AttendanceRecordModel.updateOne(
    { _id: attendanceRecord._id },
    { $push: { exceptionIds: timeException._id } },
  );

  await AttendanceCorrectionRequestModel.create({
    employeeId: employees.bob._id,
    attendanceRecord: attendanceRecord._id,
    reason: 'Forgot to punch out after client call',
    status: CorrectionRequestStatus.SUBMITTED,
  });

  await NotificationLogModel.create({
    to: employees.bob._id,
    type: 'AttendanceException',
    message: 'Attendance exception created for Jan 6 shift.',
  });

  return {
    shiftTypes: { morningShiftType, nightShiftType },
    shifts: { standardMorningShift, standardNightShift },
  };
}
