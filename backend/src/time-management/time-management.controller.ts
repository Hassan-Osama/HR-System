import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TimeManagementService } from './time-management.service';
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
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

@ApiTags('Time Management')
@ApiBearerAuth()
@Controller('time-management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeManagementController {
  constructor(private readonly timeManagementService: TimeManagementService) {}

  // ==================== SHIFT TYPES ====================

  @Post('shift-types')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Create a new shift type' })
  @ApiResponse({ status: 201, description: 'Shift type created successfully' })
  createShiftType(@Body() dto: CreateShiftTypeDto) {
    return this.timeManagementService.createShiftType(dto);
  }

  @Get('shift-types')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get all shift types' })
  @ApiResponse({ status: 200, description: 'List of shift types' })
  getShiftTypes() {
    return this.timeManagementService.getShiftTypes();
  }

  @Get('shift-types/:id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get shift type by ID' })
  @ApiResponse({ status: 200, description: 'Shift type details' })
  @ApiResponse({ status: 404, description: 'Shift type not found' })
  getShiftTypeById(@Param('id') id: string) {
    return this.timeManagementService.getShiftTypeById(id);
  }

  @Patch('shift-types/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Update a shift type' })
  @ApiResponse({ status: 200, description: 'Shift type updated successfully' })
  @ApiResponse({ status: 404, description: 'Shift type not found' })
  updateShiftType(@Param('id') id: string, @Body() dto: UpdateShiftTypeDto) {
    return this.timeManagementService.updateShiftType(id, dto);
  }

  @Delete('shift-types/:id')
  @Roles(SystemRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete a shift type' })
  @ApiResponse({ status: 200, description: 'Shift type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shift type not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete shift type in use' })
  deleteShiftType(@Param('id') id: string) {
    return this.timeManagementService.deleteShiftType(id);
  }

  // ==================== SHIFT ASSIGNMENTS ====================

  @Post('shifts/assign')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER)
  @ApiOperation({ summary: 'Assign a shift to employee(s), department, or position' })
  @ApiResponse({ status: 201, description: 'Shift assigned successfully' })
  assignShift(@Body() dto: AssignShiftDto) {
    return this.timeManagementService.assignShift(dto);
  }

  @Get('shifts')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get all shift assignments' })
  @ApiResponse({ status: 200, description: 'List of shift assignments' })
  getShifts(@Request() req) {
    // Department Heads can only see their department's shifts
    if (req.user.role === SystemRole.DEPARTMENT_HEAD && req.user.departmentId) {
      return this.timeManagementService.getShifts({ departmentId: req.user.departmentId });
    }
    // Department Employees can only see their own shifts
    if (req.user.role === SystemRole.DEPARTMENT_EMPLOYEE) {
      return this.timeManagementService.getShifts({ employeeId: req.user.userId });
    }
    return this.timeManagementService.getShifts();
  }

  @Get('shifts/:id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get shift assignment by ID' })
  @ApiResponse({ status: 200, description: 'Shift assignment details' })
  @ApiResponse({ status: 404, description: 'Shift assignment not found' })
  getShiftById(@Param('id') id: string) {
    return this.timeManagementService.getShiftById(id);
  }

  @Get('shifts/employee/:employeeId')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get all shift assignments for a specific employee' })
  @ApiResponse({ status: 200, description: 'List of employee shift assignments' })
  getShiftsByEmployee(@Param('employeeId') employeeId: string, @Request() req) {
    // Employees can only view their own shifts
    if (req.user.role === SystemRole.DEPARTMENT_EMPLOYEE && req.user.userId !== employeeId) {
      throw new Error('Unauthorized: You can only view your own shifts');
    }
    return this.timeManagementService.getShiftsByEmployee(employeeId);
  }

  @Patch('shifts/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update a shift assignment' })
  @ApiResponse({ status: 200, description: 'Shift assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Shift assignment not found' })
  updateShift(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.timeManagementService.updateShift(id, dto);
  }

  @Patch('shifts/:id/status')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update shift assignment status' })
  @ApiResponse({ status: 200, description: 'Shift status updated successfully' })
  @ApiResponse({ status: 404, description: 'Shift assignment not found' })
  updateShiftStatus(@Param('id') id: string, @Body() dto: UpdateShiftStatusDto) {
    return this.timeManagementService.updateShiftStatus(id, dto);
  }

  @Delete('shifts/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Delete a shift assignment' })
  @ApiResponse({ status: 200, description: 'Shift assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shift assignment not found' })
  deleteShift(@Param('id') id: string) {
    return this.timeManagementService.deleteShift(id);
  }

  // ==================== SCHEDULE RULES ====================

  @Post('schedule-rules')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Create a new schedule rule' })
  @ApiResponse({ status: 201, description: 'Schedule rule created successfully' })
  createScheduleRule(@Body() dto: CreateScheduleRuleDto) {
    return this.timeManagementService.createScheduleRule(dto);
  }

  @Get('schedule-rules')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get all schedule rules' })
  @ApiResponse({ status: 200, description: 'List of schedule rules' })
  getScheduleRules() {
    return this.timeManagementService.getScheduleRules();
  }

  @Get('schedule-rules/:id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get schedule rule by ID' })
  @ApiResponse({ status: 200, description: 'Schedule rule details' })
  @ApiResponse({ status: 404, description: 'Schedule rule not found' })
  getScheduleRuleById(@Param('id') id: string) {
    return this.timeManagementService.getScheduleRuleById(id);
  }

  @Patch('schedule-rules/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Update a schedule rule' })
  @ApiResponse({ status: 200, description: 'Schedule rule updated successfully' })
  @ApiResponse({ status: 404, description: 'Schedule rule not found' })
  updateScheduleRule(@Param('id') id: string, @Body() dto: UpdateScheduleRuleDto) {
    return this.timeManagementService.updateScheduleRule(id, dto);
  }

  @Delete('schedule-rules/:id')
  @Roles(SystemRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete a schedule rule' })
  @ApiResponse({ status: 200, description: 'Schedule rule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Schedule rule not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete schedule rule in use' })
  deleteScheduleRule(@Param('id') id: string) {
    return this.timeManagementService.deleteScheduleRule(id);
  }

  // ==================== HOLIDAYS ====================

  @Post('holidays')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Create a new holiday' })
  @ApiResponse({ status: 201, description: 'Holiday created successfully' })
  createHoliday(@Body() dto: CreateHolidayDto) {
    return this.timeManagementService.createHoliday(dto);
  }

  @Get('holidays')
  @ApiOperation({ summary: 'Get all holidays' })
  @ApiResponse({ status: 200, description: 'List of holidays' })
  getHolidays() {
    return this.timeManagementService.getHolidays();
  }

  @Get('holidays/:id')
  @ApiOperation({ summary: 'Get holiday by ID' })
  @ApiResponse({ status: 200, description: 'Holiday details' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  getHolidayById(@Param('id') id: string) {
    return this.timeManagementService.getHolidayById(id);
  }

  @Patch('holidays/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Update a holiday' })
  @ApiResponse({ status: 200, description: 'Holiday updated successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  updateHoliday(@Param('id') id: string, @Body() dto: UpdateHolidayDto) {
    return this.timeManagementService.updateHoliday(id, dto);
  }

  @Delete('holidays/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  @ApiOperation({ summary: 'Delete a holiday' })
  @ApiResponse({ status: 200, description: 'Holiday deleted successfully' })
  @ApiResponse({ status: 404, description: 'Holiday not found' })
  deleteHoliday(@Param('id') id: string) {
    return this.timeManagementService.deleteHoliday(id);
  }

  // ==================== ATTENDANCE - CLOCK IN/OUT (Story 5) ====================

  @Post('attendance/clock-in')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST,
    SystemRole.RECRUITER,
    SystemRole.FINANCE_STAFF,
    SystemRole.LEGAL_POLICY_ADMIN
  )
  @ApiOperation({ summary: 'Clock in for the day' })
  @ApiResponse({ status: 201, description: 'Clock-in successful' })
  clockIn(@Body() dto: ClockInDto) {
    return this.timeManagementService.clockIn(dto);
  }

  @Post('attendance/clock-out')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST,
    SystemRole.RECRUITER,
    SystemRole.FINANCE_STAFF,
    SystemRole.LEGAL_POLICY_ADMIN
  )
  @ApiOperation({ summary: 'Clock out for the day' })
  @ApiResponse({ status: 201, description: 'Clock-out successful' })
  clockOut(@Body() dto: ClockOutDto) {
    return this.timeManagementService.clockOut(dto);
  }

  @Get('attendance')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST
  )
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'List of attendance records' })
  getAttendanceRecords(@Request() req) {
    // Department Employees can only see their own attendance
    if (req.user.role === SystemRole.DEPARTMENT_EMPLOYEE) {
      return this.timeManagementService.getAttendanceByEmployee(req.user.userId);
    }
    return this.timeManagementService.getAttendanceRecords();
  }

  @Get('attendance/my-today')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST,
    SystemRole.RECRUITER,
    SystemRole.FINANCE_STAFF,
    SystemRole.LEGAL_POLICY_ADMIN
  )
  @ApiOperation({ summary: 'Get my attendance for today' })
  @ApiResponse({ status: 200, description: 'Today\'s attendance record' })
  getMyAttendanceToday(@Request() req) {
    return this.timeManagementService.getMyAttendanceToday(req.user.userId);
  }

  @Get('attendance/:id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST
  )
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiResponse({ status: 200, description: 'Attendance record details' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  getAttendanceById(@Param('id') id: string) {
    return this.timeManagementService.getAttendanceById(id);
  }

  @Get('attendance/employee/:employeeId')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST
  )
  @ApiOperation({ summary: 'Get attendance records for a specific employee' })
  @ApiResponse({ status: 200, description: 'List of employee attendance records' })
  getAttendanceByEmployee(@Param('employeeId') employeeId: string, @Request() req) {
    // Department employees can only view their own attendance
    if (req.user.role === SystemRole.DEPARTMENT_EMPLOYEE && req.user.userId !== employeeId) {
      throw new ForbiddenException('You can only view your own attendance records');
    }
    return this.timeManagementService.getAttendanceByEmployee(employeeId);
  }

  // ==================== MANUAL CORRECTION (Story 6) ====================

  @Patch('attendance/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD)
  @ApiOperation({ summary: 'Manually correct an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance corrected successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  correctAttendance(@Param('id') id: string, @Body() dto: ManualCorrectionDto) {
    return this.timeManagementService.correctAttendance(id, dto);
  }

  // ==================== PUNCH POLICY (Story 7) ====================

  @Get('settings/punch-policy')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get current punch policy' })
  @ApiResponse({ status: 200, description: 'Current punch policy setting' })
  getPunchPolicy() {
    return this.timeManagementService.getPunchPolicy();
  }

  @Patch('settings/punch-policy')
  @Roles(SystemRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Update punch policy' })
  @ApiResponse({ status: 200, description: 'Punch policy updated successfully' })
  updatePunchPolicy(@Body() dto: UpdatePunchPolicyDto) {
    return this.timeManagementService.updatePunchPolicy(dto);
  }

  // ==================== CORRECTION REQUESTS (Story 12 & 13) ====================

  @Post('corrections')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST,
    SystemRole.RECRUITER,
    SystemRole.FINANCE_STAFF,
    SystemRole.LEGAL_POLICY_ADMIN
  )
  @ApiOperation({ summary: 'Submit a correction request' })
  @ApiResponse({ status: 201, description: 'Correction request submitted successfully' })
  createCorrectionRequest(@Body() dto: CreateCorrectionRequestDto) {
    return this.timeManagementService.createCorrectionRequest(dto);
  }

  @Get('corrections')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.DEPARTMENT_HEAD
  )
  @ApiOperation({ summary: 'Get all correction requests' })
  @ApiResponse({ status: 200, description: 'List of correction requests' })
  getCorrectionRequests() {
    return this.timeManagementService.getCorrectionRequests();
  }

  @Get('corrections/pending')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.DEPARTMENT_HEAD
  )
  @ApiOperation({ summary: 'Get pending correction requests for approval' })
  @ApiResponse({ status: 200, description: 'List of pending correction requests' })
  getPendingRequests() {
    return this.timeManagementService.getPendingRequests();
  }

  @Get('corrections/my-requests')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE,
    SystemRole.PAYROLL_MANAGER,
    SystemRole.PAYROLL_SPECIALIST,
    SystemRole.RECRUITER,
    SystemRole.FINANCE_STAFF,
    SystemRole.LEGAL_POLICY_ADMIN
  )
  @ApiOperation({ summary: 'Get my correction requests' })
  @ApiResponse({ status: 200, description: 'List of my correction requests' })
  getMyRequests(@Request() req) {
    return this.timeManagementService.getMyRequests(req.user.userId);
  }

  @Get('corrections/:id')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.HR_EMPLOYEE,
    SystemRole.DEPARTMENT_HEAD,
    SystemRole.DEPARTMENT_EMPLOYEE
  )
  @ApiOperation({ summary: 'Get correction request by ID' })
  @ApiResponse({ status: 200, description: 'Correction request details' })
  @ApiResponse({ status: 404, description: 'Correction request not found' })
  getCorrectionRequestById(@Param('id') id: string) {
    return this.timeManagementService.getCorrectionRequestById(id);
  }

  @Patch('corrections/:id/review')
  @Roles(
    SystemRole.SYSTEM_ADMIN,
    SystemRole.HR_ADMIN,
    SystemRole.HR_MANAGER,
    SystemRole.DEPARTMENT_HEAD
  )
  @ApiOperation({ summary: 'Review (approve/reject) a correction request' })
  @ApiResponse({ status: 200, description: 'Correction request reviewed successfully' })
  @ApiResponse({ status: 404, description: 'Correction request not found' })
  reviewCorrectionRequest(@Param('id') id: string, @Body() dto: ReviewCorrectionDto) {
    return this.timeManagementService.reviewCorrectionRequest(id, dto);
  }
}
