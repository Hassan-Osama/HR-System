import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { ShiftType, ShiftTypeDocument } from './models/shift-type.schema';
import { ShiftAssignment, ShiftAssignmentDocument } from './models/shift-assignment.schema';
import { ScheduleRule, ScheduleRuleDocument } from './models/schedule-rule.schema';
import { Holiday, HolidayDocument } from './models/holiday.schema';
import { NotificationLog } from './models/notification-log.schema';
import { AttendanceRecord, AttendanceRecordDocument, Punch } from './models/attendance-record.schema';
import { AttendanceCorrectionRequest, AttendanceCorrectionRequestDocument } from './models/attendance-correction-request.schema';
import { Settings, SettingsDocument } from './models/settings.schema';
import { OvertimeRule, OvertimeRuleDocument } from './models/overtime-rule.schema';
import { LatenessRule, LatenessRuleDocument } from './models/lateness-rule.schema';
import { TimeException, TimeExceptionDocument } from './models/time-exception.schema';
import {
  CreateShiftTypeDto,
  UpdateShiftTypeDto,
  AssignShiftDto,
  UpdateShiftDto,
  UpdateShiftStatusDto,
  CreateScheduleRuleDto,
  UpdateScheduleRuleDto,
  CreateHolidayDto,
  UpdateHolidayDto,
  ClockInDto,
  ClockOutDto,
  ManualCorrectionDto,
  UpdatePunchPolicyDto,
  CreateCorrectionRequestDto,
  ReviewCorrectionDto,
  CreateOvertimeRuleDto,
  UpdateOvertimeRuleDto,
  CreateLatenessRuleDto,
  UpdateLatenessRuleDto,
  GetReportDto,
} from './dto';
import { ShiftAssignmentStatus, PunchType, CorrectionRequestStatus, TimeExceptionType, TimeExceptionStatus } from './models/enums';
import { ReviewAction } from './dto/review-correction.dto';

// Integration Services
import { PayrollIntegrationService, PayrollDailyPayload, PayrollException } from './integrations/payroll-integration.service';
import { LeavesIntegrationService } from './integrations/leaves-integration.service';
import { OrgStructureIntegrationService } from './integrations/org-structure-integration.service';
import { NotificationIntegrationService } from './integrations/notification-integration.service';
import { PerformanceIntegrationService } from './integrations/performance-integration.service';

@Injectable()
export class TimeManagementService {
  private readonly logger = new Logger(TimeManagementService.name);

  constructor(
    @InjectModel(ShiftType.name) private shiftTypeModel: Model<ShiftTypeDocument>,
    @InjectModel(ShiftAssignment.name) private shiftAssignmentModel: Model<ShiftAssignmentDocument>,
    @InjectModel(ScheduleRule.name) private scheduleRuleModel: Model<ScheduleRuleDocument>,
    @InjectModel(Holiday.name) private holidayModel: Model<HolidayDocument>,
    @InjectModel(NotificationLog.name) private notificationLogModel: Model<NotificationLog>,
    @InjectModel(AttendanceRecord.name) private attendanceRecordModel: Model<AttendanceRecordDocument>,
    @InjectModel(AttendanceCorrectionRequest.name) private correctionRequestModel: Model<AttendanceCorrectionRequestDocument>,
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
    @InjectModel(OvertimeRule.name) private overtimeRuleModel: Model<OvertimeRuleDocument>,
    @InjectModel(LatenessRule.name) private latenessRuleModel: Model<LatenessRuleDocument>,
    @InjectModel(TimeException.name) private timeExceptionModel: Model<TimeExceptionDocument>,
    // Integration Services
    private readonly payrollIntegration: PayrollIntegrationService,
    private readonly leavesIntegration: LeavesIntegrationService,
    private readonly orgStructureIntegration: OrgStructureIntegrationService,
    private readonly notificationIntegration: NotificationIntegrationService,
    private readonly performanceIntegration: PerformanceIntegrationService,
  ) { }

  // ==================== SHIFT TYPES ====================

  async createShiftType(dto: CreateShiftTypeDto) {
    const shiftType = new this.shiftTypeModel(dto);
    return shiftType.save();
  }

  async getShiftTypes() {
    return this.shiftTypeModel.find().exec();
  }

  async getShiftTypeById(id: string) {
    const shiftType = await this.shiftTypeModel.findById(id).exec();
    if (!shiftType) {
      throw new NotFoundException(`Shift type with ID ${id} not found`);
    }
    return shiftType;
  }

  async updateShiftType(id: string, dto: UpdateShiftTypeDto) {
    const shiftType = await this.shiftTypeModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    ).exec();

    if (!shiftType) {
      throw new NotFoundException(`Shift type with ID ${id} not found`);
    }
    return shiftType;
  }

  async deleteShiftType(id: string) {
    // Check if shift type is in use
    const inUse = await this.shiftAssignmentModel.exists({ shiftId: id });
    if (inUse) {
      throw new BadRequestException('Cannot delete shift type that is currently assigned to shifts');
    }

    const result = await this.shiftTypeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Shift type with ID ${id} not found`);
    }
    return { message: 'Shift type deleted successfully' };
  }

  // ==================== SHIFT ASSIGNMENTS ====================

  async assignShift(dto: AssignShiftDto) {
    // Validate that at least one of employeeId, departmentId, or positionId is provided
    if (!dto.employeeId && !dto.departmentId && !dto.positionId) {
      throw new BadRequestException('At least one of employeeId, departmentId, or positionId must be provided');
    }

    const assignment = new this.shiftAssignmentModel({
      employeeId: dto.employeeId,
      departmentId: dto.departmentId,
      positionId: dto.positionId,
      shiftTypeId: dto.shiftTypeId,
      shiftId: dto.shiftId,
      scheduleRuleId: dto.scheduleRuleId,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status || ShiftAssignmentStatus.PENDING,
    });

    return assignment.save();
  }

  async getShifts(query?: any) {
    return this.shiftAssignmentModel
      .find(query || {})
      .populate('employeeId', 'firstName lastName employeeNumber')
      .populate('departmentId', 'name')
      .populate('positionId', 'title')
      .populate('shiftTypeId', 'name')
      .populate('shiftId')
      .populate('scheduleRuleId')
      .exec();
  }

  async getShiftById(id: string) {
    const shift = await this.shiftAssignmentModel
      .findById(id)
      .populate('employeeId', 'firstName lastName employeeNumber')
      .populate('departmentId', 'name')
      .populate('positionId', 'title')
      .populate('shiftTypeId', 'name')
      .populate('shiftId')
      .populate('scheduleRuleId')
      .exec();

    if (!shift) {
      throw new NotFoundException(`Shift assignment with ID ${id} not found`);
    }
    return shift;
  }

  async getShiftsByEmployee(employeeId: string) {
    return this.shiftAssignmentModel
      .find({ employeeId })
      .populate('shiftTypeId', 'name')
      .populate('shiftId')
      .populate('scheduleRuleId')
      .exec();
  }

  async updateShift(id: string, dto: UpdateShiftDto) {
    const updateData: any = {};

    if (dto.employeeId) updateData.employeeId = dto.employeeId;
    if (dto.departmentId) updateData.departmentId = dto.departmentId;
    if (dto.positionId) updateData.positionId = dto.positionId;
    if (dto.shiftTypeId) updateData.shiftTypeId = dto.shiftTypeId;
    if (dto.shiftId) updateData.shiftId = dto.shiftId;
    if (dto.scheduleRuleId) updateData.scheduleRuleId = dto.scheduleRuleId;
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);
    if (dto.status) updateData.status = dto.status;

    const shift = await this.shiftAssignmentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('employeeId', 'firstName lastName employeeNumber')
      .populate('departmentId', 'name')
      .populate('positionId', 'title')
      .populate('shiftTypeId', 'name')
      .populate('shiftId')
      .populate('scheduleRuleId')
      .exec();

    if (!shift) {
      throw new NotFoundException(`Shift assignment with ID ${id} not found`);
    }
    return shift;
  }

  async updateShiftStatus(id: string, dto: UpdateShiftStatusDto) {
    const shift = await this.shiftAssignmentModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true }
    )
      .populate('employeeId', 'firstName lastName employeeNumber')
      .populate('departmentId', 'name')
      .populate('positionId', 'title')
      .populate('shiftTypeId', 'name')
      .populate('shiftId')
      .populate('scheduleRuleId')
      .exec();

    if (!shift) {
      throw new NotFoundException(`Shift assignment with ID ${id} not found`);
    }
    return shift;
  }

  async deleteShift(id: string) {
    const result = await this.shiftAssignmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Shift assignment with ID ${id} not found`);
    }
    return { message: 'Shift assignment deleted successfully' };
  }

  // ==================== SCHEDULE RULES ====================

  async createScheduleRule(dto: CreateScheduleRuleDto) {
    const rule = new this.scheduleRuleModel(dto);
    return rule.save();
  }

  async getScheduleRules() {
    return this.scheduleRuleModel.find().exec();
  }

  async getScheduleRuleById(id: string) {
    const rule = await this.scheduleRuleModel.findById(id).exec();
    if (!rule) {
      throw new NotFoundException(`Schedule rule with ID ${id} not found`);
    }
    return rule;
  }

  async updateScheduleRule(id: string, dto: UpdateScheduleRuleDto) {
    const rule = await this.scheduleRuleModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    ).exec();

    if (!rule) {
      throw new NotFoundException(`Schedule rule with ID ${id} not found`);
    }
    return rule;
  }

  async deleteScheduleRule(id: string) {
    // Check if schedule rule is in use
    const inUse = await this.shiftAssignmentModel.exists({ scheduleRuleId: id });
    if (inUse) {
      throw new BadRequestException('Cannot delete schedule rule that is currently in use');
    }

    const result = await this.scheduleRuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Schedule rule with ID ${id} not found`);
    }
    return { message: 'Schedule rule deleted successfully' };
  }

  // ==================== HOLIDAYS ====================

  async createHoliday(dto: CreateHolidayDto) {
    const holiday = new this.holidayModel({
      type: dto.type,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      name: dto.name,
      active: dto.active !== undefined ? dto.active : true,
    });
    return holiday.save();
  }

  async getHolidays() {
    return this.holidayModel.find().exec();
  }

  async getHolidayById(id: string) {
    const holiday = await this.holidayModel.findById(id).exec();
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async updateHoliday(id: string, dto: UpdateHolidayDto) {
    const updateData: any = {};

    if (dto.type) updateData.type = dto.type;
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);
    if (dto.name) updateData.name = dto.name;
    if (dto.active !== undefined) updateData.active = dto.active;

    const holiday = await this.holidayModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();

    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async deleteHoliday(id: string) {
    const result = await this.holidayModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return { message: 'Holiday deleted successfully' };
  }

  // ==================== ATTENDANCE - CLOCK IN/OUT (Story 5) ====================

  private getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  async clockIn(dto: ClockInDto) {
    const today = this.getTodayDate();
    const punchTime = dto.time ? new Date(dto.time) : new Date();

    // Find or create today's attendance record
    let record = await this.attendanceRecordModel.findOne({
      employeeId: new Types.ObjectId(dto.employeeId),
      date: today,
    });

    if (!record) {
      record = new this.attendanceRecordModel({
        employeeId: new Types.ObjectId(dto.employeeId),
        date: today,
        punches: [],
      });
    }

    // Check punch policy
    const policyDoc = await this.settingsModel.findOne({ key: 'PUNCH_POLICY' });
    const policy = policyDoc?.value || 'MULTIPLE';

    if (policy === 'FIRST_LAST' && record.punches.some(p => p.type === PunchType.IN)) {
      // Already has a clock-in, don't add another
      return { message: 'Already clocked in for today (FIRST_LAST policy)', record };
    }

    const punch: Punch = {
      type: PunchType.IN,
      time: punchTime,
      location: dto.location,
    };

    record.punches.push(punch);
    await record.save();

    return { message: 'Clock-in successful', record };
  }

  async clockOut(dto: ClockOutDto) {
    const today = this.getTodayDate();
    const punchTime = dto.time ? new Date(dto.time) : new Date();

    const record = await this.attendanceRecordModel.findOne({
      employeeId: new Types.ObjectId(dto.employeeId),
      date: today,
    });

    if (!record) {
      throw new BadRequestException('No clock-in record found for today. Please clock in first.');
    }

    const lastPunch = record.punches[record.punches.length - 1];
    if (lastPunch?.type === PunchType.OUT) {
      // Check punch policy
      const policyDoc = await this.settingsModel.findOne({ key: 'PUNCH_POLICY' });
      const policy = policyDoc?.value || 'MULTIPLE';

      if (policy === 'FIRST_LAST') {
        // Update the last OUT punch
        record.punches[record.punches.length - 1].time = punchTime;
        if (dto.location) record.punches[record.punches.length - 1].location = dto.location;
        await record.save();
        return { message: 'Clock-out updated (FIRST_LAST policy)', record };
      }
    }

    const punch: Punch = {
      type: PunchType.OUT,
      time: punchTime,
      location: dto.location,
    };

    record.punches.push(punch);

    // Calculate total work minutes
    record.totalWorkMinutes = this.calculateWorkMinutes(record.punches);
    record.hasMissedPunch = false;

    await record.save();

    return { message: 'Clock-out successful', record };
  }

  private calculateWorkMinutes(punches: Punch[]): number {
    let totalMinutes = 0;
    const sortedPunches = [...punches].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    for (let i = 0; i < sortedPunches.length - 1; i += 2) {
      if (sortedPunches[i].type === PunchType.IN && sortedPunches[i + 1]?.type === PunchType.OUT) {
        const inTime = new Date(sortedPunches[i].time).getTime();
        const outTime = new Date(sortedPunches[i + 1].time).getTime();
        totalMinutes += (outTime - inTime) / (1000 * 60);
      }
    }

    return Math.round(totalMinutes);
  }

  async getAttendanceRecords(query?: any) {
    return this.attendanceRecordModel
      .find(query || {})
      .populate('employeeId', 'firstName lastName fullName employeeNumber')
      .sort({ date: -1 })
      .exec();
  }

  async getAttendanceById(id: string) {
    const record = await this.attendanceRecordModel
      .findById(id)
      .populate('employeeId', 'firstName lastName fullName employeeNumber')
      .exec();

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return record;
  }

  async getAttendanceByEmployee(employeeId: string) {
    return this.attendanceRecordModel
      .find({ employeeId: new Types.ObjectId(employeeId) })
      .sort({ date: -1 })
      .exec();
  }

  async getMyAttendanceToday(employeeId: string) {
    const today = this.getTodayDate();
    return this.attendanceRecordModel.findOne({
      employeeId: new Types.ObjectId(employeeId),
      date: today,
    });
  }

  // ==================== MANUAL CORRECTION (Story 6) ====================

  async correctAttendance(id: string, dto: ManualCorrectionDto) {
    const record = await this.attendanceRecordModel.findById(id);

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    // Replace punches with corrected ones
    record.punches = dto.punches.map(p => ({
      type: p.type === 'IN' ? PunchType.IN : PunchType.OUT,
      time: new Date(p.time),
    }));

    record.correctedBy = new Types.ObjectId(dto.correctedBy);
    record.correctionReason = dto.reason;
    record.totalWorkMinutes = this.calculateWorkMinutes(record.punches);
    record.hasMissedPunch = false;
    record.finalisedForPayroll = true;

    await record.save();

    return { message: 'Attendance corrected successfully', record };
  }

  // ==================== PUNCH POLICY (Story 7) ====================

  async getPunchPolicy() {
    const policy = await this.settingsModel.findOne({ key: 'PUNCH_POLICY' });
    if (!policy) {
      // Return default
      return { key: 'PUNCH_POLICY', value: 'MULTIPLE', description: 'Default punch policy' };
    }
    return policy;
  }

  async updatePunchPolicy(dto: UpdatePunchPolicyDto) {
    const policy = await this.settingsModel.findOneAndUpdate(
      { key: 'PUNCH_POLICY' },
      {
        value: dto.policy,
        description: dto.policy === 'MULTIPLE'
          ? 'Multiple punches allowed per day'
          : 'Only first clock-in and last clock-out count'
      },
      { upsert: true, new: true }
    );
    return policy;
  }

  // ==================== CORRECTION REQUESTS (Story 12 & 13) ====================

  async createCorrectionRequest(dto: CreateCorrectionRequestDto) {
    const request = new this.correctionRequestModel({
      employeeId: new Types.ObjectId(dto.employeeId),
      attendanceRecordId: dto.attendanceRecordId ? new Types.ObjectId(dto.attendanceRecordId) : undefined,
      date: new Date(dto.date),
      requestedPunches: dto.requestedPunches.map(p => ({
        type: p.type === 'IN' ? PunchType.IN : PunchType.OUT,
        time: new Date(p.time),
      })),
      reason: dto.reason,
      status: CorrectionRequestStatus.SUBMITTED,
    });

    await request.save();

    // Mark attendance record as not finalized if it exists
    if (dto.attendanceRecordId) {
      await this.attendanceRecordModel.findByIdAndUpdate(
        dto.attendanceRecordId,
        { finalisedForPayroll: false }
      );
    }

    return request;
  }

  async getCorrectionRequests() {
    return this.correctionRequestModel
      .find()
      .populate('employeeId', 'firstName lastName fullName employeeNumber')
      .populate('reviewedBy', 'firstName lastName fullName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getCorrectionRequestById(id: string) {
    const request = await this.correctionRequestModel
      .findById(id)
      .populate('employeeId', 'firstName lastName fullName employeeNumber')
      .populate('attendanceRecordId')
      .populate('reviewedBy', 'firstName lastName fullName')
      .exec();

    if (!request) {
      throw new NotFoundException(`Correction request with ID ${id} not found`);
    }
    return request;
  }

  async getMyRequests(employeeId: string) {
    return this.correctionRequestModel
      .find({ employeeId: new Types.ObjectId(employeeId) })
      .populate('reviewedBy', 'firstName lastName fullName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPendingRequests() {
    return this.correctionRequestModel
      .find({ status: CorrectionRequestStatus.SUBMITTED })
      .populate('employeeId', 'firstName lastName fullName employeeNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  async reviewCorrectionRequest(id: string, dto: ReviewCorrectionDto) {
    const request = await this.correctionRequestModel.findById(id);

    if (!request) {
      throw new NotFoundException(`Correction request with ID ${id} not found`);
    }

    if (request.status !== CorrectionRequestStatus.SUBMITTED) {
      throw new BadRequestException('This request has already been reviewed');
    }

    request.status = dto.action === ReviewAction.APPROVE
      ? CorrectionRequestStatus.APPROVED
      : CorrectionRequestStatus.REJECTED;
    request.reviewedBy = new Types.ObjectId(dto.reviewedBy);
    request.reviewComment = dto.comment;
    request.reviewedAt = new Date();

    await request.save();

    // If approved, update the attendance record
    if (dto.action === ReviewAction.APPROVE) {
      const dateStart = new Date(request.date);
      dateStart.setHours(0, 0, 0, 0);

      let attendanceRecord = await this.attendanceRecordModel.findOne({
        employeeId: request.employeeId,
        date: dateStart,
      });

      if (!attendanceRecord) {
        attendanceRecord = new this.attendanceRecordModel({
          employeeId: request.employeeId,
          date: dateStart,
          punches: [],
        });
      }

      attendanceRecord.punches = request.requestedPunches;
      attendanceRecord.totalWorkMinutes = this.calculateWorkMinutes(attendanceRecord.punches);
      attendanceRecord.hasMissedPunch = false;
      attendanceRecord.finalisedForPayroll = true;
      attendanceRecord.correctedBy = new Types.ObjectId(dto.reviewedBy);
      attendanceRecord.correctionReason = `Approved correction request: ${request.reason}`;

      await attendanceRecord.save();

      // Send notification via integration service (Story 13)
      await this.notificationIntegration.notifyCorrectionStatus(
        request.employeeId.toString(),
        id,
        'APPROVED',
        dto.comment,
      );
    } else {
      // Send rejection notification via integration service (Story 13)
      await this.notificationIntegration.notifyCorrectionStatus(
        request.employeeId.toString(),
        id,
        'REJECTED',
        dto.comment,
      );
    }

    return request;
  }

  // ==================== OVERTIME RULES ====================

  async createOvertimeRule(dto: CreateOvertimeRuleDto) {
    const overtimeRule = new this.overtimeRuleModel(dto);
    return overtimeRule.save();
  }

  async getOvertimeRules() {
    return this.overtimeRuleModel.find().exec();
  }

  async getOvertimeRuleById(id: string) {
    const rule = await this.overtimeRuleModel.findById(id).exec();
    if (!rule) {
      throw new NotFoundException(`Overtime rule with ID ${id} not found`);
    }
    return rule;
  }

  async updateOvertimeRule(id: string, dto: UpdateOvertimeRuleDto) {
    const rule = await this.overtimeRuleModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    ).exec();

    if (!rule) {
      throw new NotFoundException(`Overtime rule with ID ${id} not found`);
    }
    return rule;
  }

  async deleteOvertimeRule(id: string) {
    const result = await this.overtimeRuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Overtime rule with ID ${id} not found`);
    }
    return { message: 'Overtime rule deleted successfully' };
  }

  // ==================== LATENESS RULES ====================

  async createLatenessRule(dto: CreateLatenessRuleDto) {
    const latenessRule = new this.latenessRuleModel(dto);
    return latenessRule.save();
  }

  async getLatenessRules() {
    return this.latenessRuleModel.find().exec();
  }

  async getLatenessRuleById(id: string) {
    const rule = await this.latenessRuleModel.findById(id).exec();
    if (!rule) {
      throw new NotFoundException(`Lateness rule with ID ${id} not found`);
    }
    return rule;
  }

  async updateLatenessRule(id: string, dto: UpdateLatenessRuleDto) {
    const rule = await this.latenessRuleModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    ).exec();

    if (!rule) {
      throw new NotFoundException(`Lateness rule with ID ${id} not found`);
    }
    return rule;
  }

  async deleteLatenessRule(id: string) {
    const result = await this.latenessRuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Lateness rule with ID ${id} not found`);
    }
    return { message: 'Lateness rule deleted successfully' };
  }

  // ==================== REPORTS (Story 17) ====================

  /**
   * Get active overtime rule's minimum minutes threshold
   */
  private async getOvertimeThreshold(): Promise<number> {
    const activeRule = await this.overtimeRuleModel.findOne({ active: true, approved: true });
    return activeRule?.minMinutesBeforeOvertime || 480; // Default 8 hours
  }

  /**
   * Get active overtime rule's multiplier
   */
  private async getOvertimeMultiplier(): Promise<number> {
    const activeRule = await this.overtimeRuleModel.findOne({ active: true, approved: true });
    return activeRule?.weekdayMultiplier || 1.5; // Default 1.5x
  }

  /**
   * Get active lateness rule's grace period
   */
  private async getLatenessGracePeriod(): Promise<number> {
    const activeRule = await this.latenessRuleModel.findOne({ active: true });
    return activeRule?.gracePeriodMinutes || 15; // Default 15 minutes
  }

  /**
   * Overtime Report - Shows employees with work hours exceeding standard threshold
   * Calculates overtime based on active overtime rules
   */
  async getOvertimeReport(dto: GetReportDto) {
    const query: any = {
      date: {
        $gte: new Date(dto.startDate),
        $lte: new Date(dto.endDate),
      },
    };

    if (dto.employeeId) {
      query.employeeId = new Types.ObjectId(dto.employeeId);
    }

    const records = await this.attendanceRecordModel
      .find(query)
      .populate({
        path: 'employeeId',
        select: 'firstName lastName fullName employeeNumber primaryDepartmentId contractType',
        populate: { path: 'primaryDepartmentId', select: 'name' }
      })
      .sort({ date: -1 })
      .exec();

    // Filter by department if specified
    let filteredRecords = records;
    if (dto.departmentId) {
      filteredRecords = records.filter((record: any) => {
        const deptId = record.employeeId?.primaryDepartmentId?._id || record.employeeId?.primaryDepartmentId;
        return deptId?.toString() === dto.departmentId;
      });
    }

    // Filter by employee type if specified
    if (dto.employeeType) {
      filteredRecords = filteredRecords.filter((record: any) => {
        return record.employeeId?.contractType === dto.employeeType;
      });
    }

    // Get overtime threshold from active rule
    const overtimeThreshold = await this.getOvertimeThreshold();
    const multiplier = await this.getOvertimeMultiplier();

    // Calculate overtime data
    const overtimeData = filteredRecords.map(record => {
      const totalWorkMinutes = record.totalWorkMinutes || 0;
      const overtimeMinutes = Math.max(0, totalWorkMinutes - overtimeThreshold);
      return {
        employee: record.employeeId,
        date: record.date,
        totalWorkMinutes,
        overtimeMinutes,
        overtimeHours: Math.round(overtimeMinutes / 60 * 100) / 100,
        estimatedPay: overtimeMinutes > 0 ? `${multiplier}x rate` : null,
      };
    }).filter(r => r.overtimeMinutes > 0);

    // Summary statistics
    const totalOvertimeMinutes = overtimeData.reduce((sum, r) => sum + r.overtimeMinutes, 0);
    const uniqueEmployees = new Set(overtimeData.map(r => (r.employee as any)?._id?.toString())).size;

    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalRecords: overtimeData.length,
      summary: {
        totalOvertimeMinutes,
        totalOvertimeHours: Math.round(totalOvertimeMinutes / 60 * 100) / 100,
        employeesWithOvertime: uniqueEmployees,
        overtimeThresholdMinutes: overtimeThreshold,
        multiplier,
        averageOvertimePerRecord: overtimeData.length > 0
          ? Math.round(totalOvertimeMinutes / overtimeData.length)
          : 0,
      },
      data: overtimeData,
    };
  }

  /**
   * Lateness Report - Shows employees who arrived late
   * Includes grace period information from active lateness rules
   */
  async getLatenessReport(dto: GetReportDto) {
    const query: any = {
      date: {
        $gte: new Date(dto.startDate),
        $lte: new Date(dto.endDate),
      },
      isLate: true,
    };

    if (dto.employeeId) {
      query.employeeId = new Types.ObjectId(dto.employeeId);
    }

    console.log('[DEBUG] getLatenessReport query:', JSON.stringify(query, null, 2));

    // Debug: count all records first
    const totalCount = await this.attendanceRecordModel.countDocuments({});
    const lateCount = await this.attendanceRecordModel.countDocuments({ isLate: true });
    console.log('[DEBUG] Total records in DB:', totalCount);
    console.log('[DEBUG] Late records in DB:', lateCount);

    const records = await this.attendanceRecordModel
      .find(query)
      .populate({
        path: 'employeeId',
        select: 'firstName lastName fullName employeeNumber primaryDepartmentId contractType',
        populate: { path: 'primaryDepartmentId', select: 'name' }
      })
      .sort({ date: -1 })
      .exec();

    console.log('[DEBUG] Records found by query:', records.length);

    // Filter by department if specified
    let filteredRecords = records;
    if (dto.departmentId) {
      filteredRecords = records.filter((record: any) => {
        const deptId = record.employeeId?.primaryDepartmentId?._id || record.employeeId?.primaryDepartmentId;
        return deptId?.toString() === dto.departmentId;
      });
    }

    // Filter by employee type if specified
    if (dto.employeeType) {
      filteredRecords = filteredRecords.filter((record: any) => {
        return record.employeeId?.contractType === dto.employeeType;
      });
    }

    const gracePeriod = await this.getLatenessGracePeriod();

    const latenessData = filteredRecords.map(record => ({
      employee: record.employeeId,
      date: record.date,
      lateMinutes: record.lateMinutes || 0,
      beyondGrace: (record.lateMinutes || 0) > gracePeriod,
    }));

    // Summary statistics
    const totalLateMinutes = latenessData.reduce((sum, r) => sum + r.lateMinutes, 0);
    const uniqueEmployees = new Set(latenessData.map(r => (r.employee as any)?._id?.toString())).size;
    const beyondGraceCount = latenessData.filter(r => r.beyondGrace).length;

    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalRecords: latenessData.length,
      debug: {
        totalCount: await this.attendanceRecordModel.countDocuments({}),
        lateCount: await this.attendanceRecordModel.countDocuments({ isLate: true }),
        queryRecordsCount: records.length,
        collectionName: this.attendanceRecordModel.collection.name,
        rawQuery: JSON.stringify(query),
      },
      summary: {
        totalLateMinutes,
        totalLateHours: Math.round(totalLateMinutes / 60 * 100) / 100,
        employeesLate: uniqueEmployees,
        gracePeriodMinutes: gracePeriod,
        beyondGraceCount,
        withinGraceCount: latenessData.length - beyondGraceCount,
        averageLateMinutes: latenessData.length > 0
          ? Math.round(totalLateMinutes / latenessData.length)
          : 0,
      },
      data: latenessData,
    };
  }

  /**
   * Exceptions Report - Shows time exceptions (missed punches, corrections, etc.)
   * Queries by attendance record date for accurate date filtering
   */
  async getExceptionsReport(dto: GetReportDto) {
    // First, get attendance records in the date range
    const attendanceQuery: any = {
      date: {
        $gte: new Date(dto.startDate),
        $lte: new Date(dto.endDate),
      },
    };

    if (dto.employeeId) {
      attendanceQuery.employeeId = new Types.ObjectId(dto.employeeId);
    }

    const attendanceRecords = await this.attendanceRecordModel
      .find(attendanceQuery)
      .select('_id')
      .exec();

    const attendanceIds = attendanceRecords.map(r => r._id);

    // Query exceptions for those attendance records
    const exceptionQuery: any = {
      attendanceRecordId: { $in: attendanceIds },
    };

    if (dto.employeeId) {
      exceptionQuery.employeeId = new Types.ObjectId(dto.employeeId);
    }

    const exceptions = await this.timeExceptionModel
      .find(exceptionQuery)
      .populate({
        path: 'employeeId',
        select: 'firstName lastName fullName employeeNumber primaryDepartmentId contractType',
        populate: { path: 'primaryDepartmentId', select: 'name' }
      })
      .populate('attendanceRecordId', 'date')
      .populate('assignedTo', 'firstName lastName fullName')
      .sort({ createdAt: -1 })
      .exec();

    // Filter by department if specified
    let filteredExceptions = exceptions;
    if (dto.departmentId) {
      filteredExceptions = exceptions.filter((exc: any) => {
        const deptId = exc.employeeId?.primaryDepartmentId?._id || exc.employeeId?.primaryDepartmentId;
        return deptId?.toString() === dto.departmentId;
      });
    }

    // Filter by employee type if specified
    if (dto.employeeType) {
      filteredExceptions = filteredExceptions.filter((exc: any) => {
        return exc.employeeId?.contractType === dto.employeeType;
      });
    }

    // Summary by type and status
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    filteredExceptions.forEach((exc: any) => {
      byType[exc.type] = (byType[exc.type] || 0) + 1;
      byStatus[exc.status] = (byStatus[exc.status] || 0) + 1;
    });

    const uniqueEmployees = new Set(filteredExceptions.map((e: any) => e.employeeId?._id?.toString())).size;

    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalRecords: filteredExceptions.length,
      summary: {
        employeesWithExceptions: uniqueEmployees,
        byType,
        byStatus,
        openCount: byStatus['OPEN'] || 0,
        resolvedCount: byStatus['RESOLVED'] || 0,
        pendingCount: byStatus['PENDING'] || 0,
      },
      data: filteredExceptions.map((exc: any) => ({
        _id: exc._id,
        employee: exc.employeeId,
        type: exc.type,
        status: exc.status,
        reason: exc.reason,
        assignedTo: exc.assignedTo,
        attendanceDate: exc.attendanceRecordId?.date,
        createdAt: exc.createdAt,
      })),
    };
  }

  /**
   * Attendance Report - Comprehensive attendance data with statistics
   * Shows all attendance records with work hours, late status, and missed punches
   */
  async getAttendanceReport(dto: GetReportDto) {
    const query: any = {
      date: {
        $gte: new Date(dto.startDate),
        $lte: new Date(dto.endDate),
      },
    };

    if (dto.employeeId) {
      query.employeeId = new Types.ObjectId(dto.employeeId);
    }

    const records = await this.attendanceRecordModel
      .find(query)
      .populate({
        path: 'employeeId',
        select: 'firstName lastName fullName employeeNumber primaryDepartmentId contractType',
        populate: { path: 'primaryDepartmentId', select: 'name' }
      })
      .sort({ date: -1 })
      .exec();

    // Filter by department if specified
    let filteredRecords = records;
    if (dto.departmentId) {
      filteredRecords = records.filter((record: any) => {
        const deptId = record.employeeId?.primaryDepartmentId?._id || record.employeeId?.primaryDepartmentId;
        return deptId?.toString() === dto.departmentId;
      });
    }

    // Filter by employee type if specified
    if (dto.employeeType) {
      filteredRecords = filteredRecords.filter((record: any) => {
        return record.employeeId?.contractType === dto.employeeType;
      });
    }

    // Summary statistics
    const totalWorkMinutes = filteredRecords.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);
    const lateCount = filteredRecords.filter(r => r.isLate).length;
    const missedPunchCount = filteredRecords.filter(r => r.hasMissedPunch).length;
    const onTimeCount = filteredRecords.filter(r => !r.isLate && !r.hasMissedPunch).length;
    const uniqueEmployees = new Set(filteredRecords.map((r: any) => r.employeeId?._id?.toString())).size;

    // Calculate averages
    const avgWorkMinutes = filteredRecords.length > 0
      ? Math.round(totalWorkMinutes / filteredRecords.length)
      : 0;
    const totalLateMinutes = filteredRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0);

    // Get overtime threshold for reference
    const overtimeThreshold = await this.getOvertimeThreshold();
    const overtimeRecords = filteredRecords.filter(r => (r.totalWorkMinutes || 0) > overtimeThreshold);

    return {
      startDate: dto.startDate,
      endDate: dto.endDate,
      summary: {
        totalRecords: filteredRecords.length,
        uniqueEmployees,
        totalWorkMinutes,
        totalWorkHours: Math.round(totalWorkMinutes / 60 * 100) / 100,
        averageWorkMinutes: avgWorkMinutes,
        averageWorkHours: Math.round(avgWorkMinutes / 60 * 100) / 100,
        lateCount,
        latePercentage: filteredRecords.length > 0
          ? Math.round(lateCount / filteredRecords.length * 100)
          : 0,
        totalLateMinutes,
        missedPunchCount,
        onTimeCount,
        onTimePercentage: filteredRecords.length > 0
          ? Math.round(onTimeCount / filteredRecords.length * 100)
          : 0,
        overtimeRecords: overtimeRecords.length,
      },
      data: filteredRecords,
    };
  }

  // ==================== CROSS-MODULE INTEGRATION METHODS ====================

  /**
   * Check if employee is on approved leave for a date
   * Uses LeavesIntegrationService
   */
  async isEmployeeOnLeave(employeeId: string, date: Date): Promise<boolean> {
    return this.leavesIntegration.isEmployeeOnLeave(employeeId, date);
  }

  /**
   * Check if a date is a holiday
   */
  async isHoliday(date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const holiday = await this.holidayModel.findOne({
      startDate: { $lte: endOfDay },
      $or: [
        { endDate: { $gte: startOfDay } },
        { endDate: { $exists: false } },
        { endDate: null },
      ],
      active: true,
    });

    return !!holiday;
  }

  /**
   * Calculate overtime minutes based on active overtime rule
   */
  async calculateOvertimeMinutes(totalWorkMinutes: number, date: Date): Promise<number> {
    const activeRule = await this.overtimeRuleModel.findOne({ active: true, approved: true });
    if (!activeRule) return 0;

    const minMinutes = activeRule.minMinutesBeforeOvertime || 480; // Default 8 hours
    if (totalWorkMinutes <= minMinutes) return 0;

    return totalWorkMinutes - minMinutes;
  }

  /**
   * Calculate lateness penalty minutes based on active lateness rule
   */
  async calculateLatenessMinutes(latenessMinutes: number, employeeId: string, date: Date): Promise<number> {
    // Check if we should suppress penalty
    const shouldSuppress = await this.leavesIntegration.shouldSuppressLatenessPenalty(employeeId, date);
    if (shouldSuppress) return 0;

    const isHoliday = await this.isHoliday(date);
    if (isHoliday) return 0;

    const activeRule = await this.latenessRuleModel.findOne({ active: true });
    if (!activeRule) return latenessMinutes;

    const gracePeriod = activeRule.gracePeriodMinutes || 0;
    if (latenessMinutes <= gracePeriod) return 0;

    const penaltyMinutes = latenessMinutes - gracePeriod;
    const maxDeduction = activeRule.maxDeductionMinutes || 0;

    return maxDeduction > 0 ? Math.min(penaltyMinutes, maxDeduction) : penaltyMinutes;
  }

  // ==================== BACKGROUND JOBS ====================

  /**
   * Story 11: Flag repeated lateness (Weekly on Monday at 9 AM)
   * Creates TimeException records and notifies employees/managers
   */
  @Cron('0 9 * * 1')
  async flagRepeatedLateness() {
    this.logger.log('[CRON] Starting flagRepeatedLateness job');

    // Get active lateness rule for threshold
    const latenessRule = await this.latenessRuleModel.findOne({ active: true });
    const threshold = latenessRule?.warningThreshold || 3;
    const periodDays = latenessRule?.periodDays || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const lateRecords = await this.attendanceRecordModel.aggregate([
      {
        $match: {
          date: { $gte: startDate },
          isLate: true,
        },
      },
      {
        $group: {
          _id: '$employeeId',
          lateCount: { $sum: 1 },
          recordIds: { $push: '$_id' },
          dates: { $push: '$date' },
        },
      },
      {
        $match: {
          lateCount: { $gte: threshold },
        },
      },
    ]);

    let flaggedCount = 0;

    for (const record of lateRecords) {
      const employeeId = record._id.toString();

      // Check if employee was on leave for any of those days
      let actualLateCount = 0;
      const validRecordIds: string[] = [];

      for (let i = 0; i < record.dates.length; i++) {
        const isOnLeave = await this.isEmployeeOnLeave(employeeId, record.dates[i]);
        const isHoliday = await this.isHoliday(record.dates[i]);

        if (!isOnLeave && !isHoliday) {
          actualLateCount++;
          validRecordIds.push(record.recordIds[i].toString());
        }
      }

      if (actualLateCount >= threshold) {
        // Get employee's manager for notification and assignment
        const managerId = await this.orgStructureIntegration.getEmployeeManager(employeeId);
        const assignedTo = managerId || employeeId; // Assign to manager or self

        // Create TimeException via performance integration
        await this.performanceIntegration.flagRepeatedLateness(
          employeeId,
          actualLateCount,
          periodDays,
          validRecordIds,
          assignedTo,
        );

        // Send notifications
        await this.notificationIntegration.notifyRepeatedLateness(
          employeeId,
          actualLateCount,
          periodDays,
          managerId || undefined,
        );

        flaggedCount++;
      }
    }

    this.logger.log(`[CRON] flagRepeatedLateness completed: ${flaggedCount} employees flagged`);
  }

  /**
   * Daily Payroll Sync (Midnight - Story 16)
   * Aggregates previous day's attendance and syncs to Payroll module
   */
  @Cron('0 0 * * *')
  async syncToPayroll() {
    this.logger.log('[CRON] Starting syncToPayroll job');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Get all attendance records for yesterday
    const records = await this.attendanceRecordModel
      .find({ date: yesterday })
      .populate('employeeId', '_id');

    const payrollData: PayrollDailyPayload[] = [];

    for (const record of records) {
      const employeeIdStr = record.employeeId?.toString();
      if (!employeeIdStr) continue;

      // Check if employee was on leave
      const isOnLeave = await this.isEmployeeOnLeave(employeeIdStr, yesterday);
      const isHoliday = await this.isHoliday(yesterday);

      // Calculate overtime
      const overtimeMinutes = await this.calculateOvertimeMinutes(record.totalWorkMinutes || 0, yesterday);

      // Calculate lateness penalty (use lateMinutes from schema)
      const lateMinutes = record.lateMinutes || 0;
      const penaltyMinutes = await this.calculateLatenessMinutes(lateMinutes, employeeIdStr, yesterday);

      // Build exceptions list
      const exceptions: PayrollException[] = [];

      if (record.hasMissedPunch) {
        exceptions.push({
          type: 'MISSED_PUNCH',
          description: 'Employee has missing punch record',
          severity: 'MEDIUM',
        });
      }

      if (record.isLate && !isOnLeave && !isHoliday) {
        exceptions.push({
          type: 'MANUAL_CORRECTION',
          description: `Late arrival: ${lateMinutes} minutes`,
          minutes: lateMinutes,
          severity: 'LOW',
        });
      }

      // Check for repeated lateness exception
      const hasLatenessException = await this.timeExceptionModel.exists({
        employeeId: new Types.ObjectId(employeeIdStr),
        type: TimeExceptionType.REPEATED_LATENESS,
        status: { $in: [TimeExceptionStatus.OPEN, TimeExceptionStatus.ESCALATED] },
      });

      if (hasLatenessException) {
        exceptions.push({
          type: 'REPEATED_LATENESS',
          description: 'Employee has repeated lateness flag',
          severity: 'HIGH',
        });
      }

      payrollData.push({
        employeeId: employeeIdStr,
        date: yesterday,
        totalWorkMinutes: record.totalWorkMinutes || 0,
        overtimeMinutes,
        penaltyMinutes,
        latenessMinutes: lateMinutes,
        exceptions,
        isHoliday,
        isOnLeave,
      });
    }

    // Send to Payroll module
    const result = await this.payrollIntegration.receiveAttendanceData(payrollData);

    this.logger.log(`[CRON] syncToPayroll completed: ${result.syncedCount} synced, ${result.failedCount} failed`);
  }

  /**
   * Story 18: Escalate pending requests before payroll cut-off (Daily at 9 AM)
   */
  @Cron('0 9 * * *')
  async escalatePendingRequests() {
    this.logger.log('[CRON] Starting escalatePendingRequests job');

    // Check days until payroll cut-off
    const daysUntilCutoff = await this.payrollIntegration.getDaysUntilCutoff();

    // Find correction requests pending for more than 48 hours
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const pendingRequests = await this.correctionRequestModel
      .find({
        status: CorrectionRequestStatus.SUBMITTED,
        createdAt: { $lte: twoDaysAgo },
      })
      .populate('employeeId', '_id');

    let escalatedCount = 0;

    for (const request of pendingRequests) {
      // Update status
      request.status = CorrectionRequestStatus.ESCALATED;
      await request.save();

      const employeeId = request.employeeId?.toString() || (request.employeeId as any)?._id?.toString();

      // Get manager for escalation
      const managerId = employeeId ? await this.orgStructureIntegration.getEmployeeManager(employeeId) : null;

      // Send escalation notification
      if (managerId) {
        await this.notificationIntegration.notifyEscalation(
          managerId,
          request._id.toString(),
          daysUntilCutoff,
          employeeId,
        );
      }

      // Notify employee
      if (employeeId) {
        await this.notificationIntegration.notify({
          type: 'REQUEST_ESCALATED' as any,
          recipientId: employeeId,
          message: 'Your correction request has been escalated due to pending approval for more than 48 hours',
          priority: 'HIGH' as any,
        });
      }

      escalatedCount++;
    }

    // If close to payroll cut-off, send warning to HR
    if (daysUntilCutoff <= 3 && pendingRequests.length > 0) {
      this.logger.warn(`[CRON] Payroll cut-off in ${daysUntilCutoff} days with ${pendingRequests.length} pending requests`);
      // TODO: Get HR admin IDs and send warnings
    }

    this.logger.log(`[CRON] escalatePendingRequests completed: ${escalatedCount} escalated`);
  }

  /**
   * Story 8: Flag missed punches (Daily at 6 PM)
   * Now uses notification integration service
   */
  @Cron('0 18 * * *')
  async flagMissedPunchesEnhanced() {
    this.logger.log('[CRON] Starting flagMissedPunches job');

    const today = this.getTodayDate();
    const records = await this.attendanceRecordModel.find({ date: today });

    let flaggedCount = 0;

    for (const record of records) {
      if (record.punches.length === 0) continue;

      const lastPunch = record.punches[record.punches.length - 1];
      if (lastPunch?.type === PunchType.IN) {
        record.hasMissedPunch = true;
        await record.save();

        const employeeId = record.employeeId.toString();
        const managerId = await this.orgStructureIntegration.getEmployeeManager(employeeId);

        // Use notification integration
        await this.notificationIntegration.notifyMissedPunch(
          employeeId,
          today,
          managerId || undefined,
        );

        flaggedCount++;
      }
    }

    this.logger.log(`[CRON] flagMissedPunches completed: ${flaggedCount} employees flagged`);
  }

  /**
   * Story 4: Check for expiring shifts (Daily at 8 AM)
   * Now uses notification integration service
   */
  @Cron('0 8 * * *')
  async checkExpiringShiftsEnhanced() {
    this.logger.log('[CRON] Starting checkExpiringShifts job');

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringShifts = await this.shiftAssignmentModel
      .find({
        endDate: { $lte: sevenDaysFromNow, $gte: new Date() },
        status: ShiftAssignmentStatus.APPROVED,
      })
      .populate('employeeId', 'firstName lastName employeeNumber')
      .populate('shiftTypeId', 'name');

    for (const shift of expiringShifts) {
      const employee = shift.employeeId as any;
      const shiftType = shift.shiftTypeId as any;

      if (employee?._id && shift.endDate) {
        await this.notificationIntegration.notifyShiftExpiry(
          employee._id.toString(),
          shiftType?.name || 'Unnamed Shift',
          shift.endDate,
        );
      }
    }

    this.logger.log(`[CRON] checkExpiringShifts completed: ${expiringShifts.length} expiring shifts notified`);
  }
}
