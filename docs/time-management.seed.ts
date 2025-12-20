import mongoose from 'mongoose';
import { ShiftTypeSchema } from '../time-management/models/shift-type.schema';
import { ShiftSchema } from '../time-management/models/shift.schema';
import { HolidaySchema } from '../time-management/models/holiday.schema';
import { latenessRuleSchema } from '../time-management/models/lateness-rule.schema';
import { OvertimeRuleSchema } from '../time-management/models/overtime-rule.schema';
import { ScheduleRuleSchema } from '../time-management/models/schedule-rule.schema';
import { ShiftAssignment, ShiftAssignmentSchema } from '../time-management/models/shift-assignment.schema';
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
type SeedEmployees = { charlie: SeedRef; lina: SeedRef };

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

  console.log('Seeding Holidays...');
  await HolidayModel.create({
    type: HolidayType.NATIONAL,
    startDate: new Date('2025-01-01'),
    name: 'New Year',
    active: true,
  });
  console.log('Holidays seeded.');

  
  // time to payroll
  const workingDays = [
    '2025-12-01',
    '2025-12-02',
    '2025-12-03',
    '2025-12-04',
    '2025-12-05',
    '2025-12-06',
    '2025-12-07',
    '2025-12-08',
    '2025-12-09',
    '2025-12-10',
  ];
  
  const shiftForPayroll = await ShiftModel.create({
      name: 'SW@Standard Day (9-5)',
      shiftType: morningShiftType._id,
      startTime: '09:00',
      endTime: '17:00',
      punchPolicy: PunchPolicy.FIRST_LAST,
      graceInMinutes: 15,
      graceOutMinutes: 15,
      requiresApprovalForOvertime: true,
      active: true,
    });
    
    await ShiftAssignmentModel.create({
      employeeId: employees.bob._id,
      shiftId: shiftForPayroll._id,
      startDate: new Date('2025-12-01'),
      status: ShiftAssignmentStatus.APPROVED,
    });
    
    await ShiftAssignmentModel.create({
      employeeId: employees.bob._id,
      shiftId: standardMorningShift._id,
      startDate: new Date('2025-12-01'),
      status: ShiftAssignmentStatus.APPROVED,
    });
    
    for (const day of workingDays.slice(0, 4)) {
      await AttendanceRecordModel.create({
        employeeId: employees.alice._id,
        punches: [
          { type: PunchType.IN,  time: new Date(`${day}T09:00:00Z`) },
          { type: PunchType.OUT, time: new Date(`${day}T17:00:00Z`) },
        ],
        totalWorkMinutes: 480,
        hasMissedPunch: false,
        finalisedForPayroll: true,
      });
    }
  
    await AttendanceRecordModel.create({
      employeeId: employees.alice._id,
      punches: [
        { type: PunchType.IN,  time: new Date('2025-12-05T09:00:00Z') },
        { type: PunchType.OUT, time: new Date('2025-12-05T13:00:00Z') },
      ],
      totalWorkMinutes: 240,
      hasMissedPunch: false,
      finalisedForPayroll: true,
    });
  
    for (const day of workingDays.slice(5)) {
      await AttendanceRecordModel.create({
        employeeId: employees.alice._id,
        punches: [],
        totalWorkMinutes: 0,
        hasMissedPunch: true,
        finalisedForPayroll: true,
      });
    }
  
    for (const day of workingDays) {
      await AttendanceRecordModel.create({
        employeeId: employees.bob._id,
        punches: [
          { type: PunchType.IN,  time: new Date(`${day}T09:00:00Z`) },
          { type: PunchType.OUT, time: new Date(`${day}T17:00:00Z`) },
        ],
        totalWorkMinutes: 480,
        hasMissedPunch: false,
        finalisedForPayroll: true,
      });
    }
}
