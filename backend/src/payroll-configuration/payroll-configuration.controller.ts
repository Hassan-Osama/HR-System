import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PayrollConfigurationService } from './payroll-configuration.service';
import { RolesGuard, Roles } from './guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

// DTOs
import { CreatePayTypeDto, UpdatePayTypeDto } from './dto/pay-type.dto';
import { CreatePayGradeDto, UpdatePayGradeDto } from './dto/pay-grade.dto';
import { CreateAllowanceDto, UpdateAllowanceDto } from './dto/allowance.dto';
import {
  CreateInsuranceBracketDto,
  UpdateInsuranceBracketDto,
} from './dto/insurance-bracket.dto';
import { CreateTaxRuleDto, UpdateTaxRuleDto } from './dto/tax-rule.dto';
import { CreateBenefitDto, UpdateBenefitDto } from './dto/benefit.dto';
import {
  CreateSigningBonusDto,
  UpdateSigningBonusDto,
} from './dto/signing-bonus.dto';
import {
  CreatePayrollPolicyDto,
  UpdatePayrollPolicyDto,
} from './dto/payroll-policy.dto';
import { UpdateCompanySettingsDto } from './dto/company-settings.dto';

@Controller('payroll-configuration')
export class PayrollConfigurationController {
  constructor(
    private readonly payrollService: PayrollConfigurationService,
  ) { }

  /* ================= PAY TYPES ================= */

  @Post('pay-types')
  createPayType(@Body() dto: CreatePayTypeDto) {
    return this.payrollService.createPayType(dto);
  }

  @Get('pay-types')
  getPayTypes() {
    return this.payrollService.getPayTypes();
  }

  @Patch('pay-types/:id')
  updatePayType(
    @Param('id') id: string,
    @Body() dto: UpdatePayTypeDto,
  ) {
    return this.payrollService.updatePayType(id, dto);
  }

  @Delete('pay-types/:id')
  deletePayType(@Param('id') id: string) {
    return this.payrollService.deletePayType(id);
  }

  /* ================= PAY GRADES ================= */

  @Post('pay-grades')
  createPayGrade(@Body() dto: CreatePayGradeDto) {
    return this.payrollService.createPayGrade(dto);
  }

  @Get('pay-grades')
  getPayGrades() {
    return this.payrollService.getPayGrades();
  }

  @Patch('pay-grades/:id')
  updatePayGrade(
    @Param('id') id: string,
    @Body() dto: UpdatePayGradeDto,
  ) {
    return this.payrollService.updatePayGrade(id, dto);
  }

  @Delete('pay-grades/:id')
  deletePayGrade(@Param('id') id: string) {
    return this.payrollService.deletePayGrade(id);
  }

  /* ================= ALLOWANCES ================= */

  @Post('allowances')
  createAllowance(@Body() dto: CreateAllowanceDto) {
    return this.payrollService.createAllowance(dto);
  }

  @Get('allowances')
  getAllowances() {
    return this.payrollService.getAllowances();
  }

  @Patch('allowances/:id')
  updateAllowance(
    @Param('id') id: string,
    @Body() dto: UpdateAllowanceDto,
  ) {
    return this.payrollService.updateAllowance(id, dto);
  }

  @Delete('allowances/:id')
  deleteAllowance(@Param('id') id: string) {
    return this.payrollService.deleteAllowance(id);
  }

  /* ================= INSURANCE BRACKETS ================= */

  @Post('insurance-brackets')
  createInsuranceBracket(
    @Body() dto: CreateInsuranceBracketDto,
  ) {
    return this.payrollService.createInsuranceBracket(dto);
  }

  @Get('insurance-brackets')
  getInsuranceBrackets() {
    return this.payrollService.getInsuranceBrackets();
  }

  @Patch('insurance-brackets/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN)
  updateInsuranceBracket(
    @Param('id') id: string,
    @Body() dto: UpdateInsuranceBracketDto,
  ) {
    return this.payrollService.updateInsuranceBracket(id, dto);
  }

  @Delete('insurance-brackets/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  deleteInsuranceBracket(@Param('id') id: string) {
    return this.payrollService.deleteInsuranceBracket(id);
  }

  /* ================= TAX RULES ================= */

  @Post('tax-rules')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  )
  createTaxRule(@Body() dto: CreateTaxRuleDto) {
    console.log('🔥 DTO RECEIVED:', dto);
    return this.payrollService.createTaxRule(dto);
  }

  @Get('tax-rules')
  getTaxRules() {
    return this.payrollService.getTaxRules();
  }

  @Patch('tax-rules/:id')
  updateTaxRule(
    @Param('id') id: string,
    @Body() dto: UpdateTaxRuleDto,
  ) {
    return this.payrollService.updateTaxRule(id, dto);
  }

  @Delete('tax-rules/:id')
  deleteTaxRule(@Param('id') id: string) {
    return this.payrollService.deleteTaxRule(id);
  }

  /* ================= BENEFITS ================= */

  @Post('benefits')
  createBenefit(@Body() dto: CreateBenefitDto) {
    return this.payrollService.createBenefit(dto);
  }

  @Get('benefits')
  getBenefits() {
    return this.payrollService.getBenefits();
  }

  @Patch('benefits/:id')
  updateBenefit(
    @Param('id') id: string,
    @Body() dto: UpdateBenefitDto,
  ) {
    return this.payrollService.updateBenefit(id, dto);
  }

  @Delete('benefits/:id')
  deleteBenefit(@Param('id') id: string) {
    return this.payrollService.deleteBenefit(id);
  }

  /* ================= SIGNING BONUSES ================= */

  @Post('signing-bonuses')
  createSigningBonus(@Body() dto: CreateSigningBonusDto) {
    return this.payrollService.createSigningBonus(dto);
  }

  @Get('signing-bonuses')
  getSigningBonuses() {
    return this.payrollService.getSigningBonuses();
  }

  @Patch('signing-bonuses/:id')
  updateSigningBonus(
    @Param('id') id: string,
    @Body() dto: UpdateSigningBonusDto,
  ) {
    return this.payrollService.updateSigningBonus(id, dto);
  }

  @Delete('signing-bonuses/:id')
  deleteSigningBonus(@Param('id') id: string) {
    return this.payrollService.deleteSigningBonus(id);
  }

  /* ================= PAYROLL POLICIES ================= */

  @Post('policies')
  createPayrollPolicy(@Body() dto: CreatePayrollPolicyDto) {
    return this.payrollService.createPayrollPolicy(dto);
  }

  @Get('policies')
  getPayrollPolicies() {
    return this.payrollService.getPayrollPolicies();
  }

  @Patch('policies/:id')
  updatePayrollPolicy(
    @Param('id') id: string,
    @Body() dto: UpdatePayrollPolicyDto,
  ) {
    return this.payrollService.updatePayrollPolicy(id, dto);
  }

  @Delete('policies/:id')
  deletePayrollPolicy(@Param('id') id: string) {
    return this.payrollService.deletePayrollPolicy(id);
  }

  /* ================= COMPANY SETTINGS ================= */

  @Get('company-settings')
  getCompanySettings() {
    return this.payrollService.getCompanySettings();
  }

  @Patch('company-settings')
  updateCompanySettings(
    @Body() dto: UpdateCompanySettingsDto,
  ) {
    return this.payrollService.updateCompanySettings(dto);
  }

  /* ================= CONFIG BACKUPS ================= */

  @Post('backups/run')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.PAYROLL_MANAGER)
  runConfigBackup(@Body('triggeredBy') triggeredBy?: string) {
    return this.payrollService.runConfigBackup(triggeredBy);
  }

  @Get('backups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.PAYROLL_MANAGER)
  getBackups() {
    return this.payrollService.getConfigBackups();
  }

  @Get('backups/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.PAYROLL_MANAGER)
  getBackup(@Param('id') id: string) {
    return this.payrollService.getConfigBackupById(id);
  }

  @Post('backups/:id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN)
  restoreBackup(
    @Param('id') id: string,
    @Body('restoredBy') restoredBy?: string,
  ) {
    return this.payrollService.restoreConfigBackup(id, restoredBy);
  }

  @Delete('backups/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN)
  deleteBackup(@Param('id') id: string) {
    return this.payrollService.deleteConfigBackup(id);
  }

  /* ================= APPROVALS ================= */

  // Pay Types
  @Patch('pay-types/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approvePayType(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approvePayType(id, userId);
  }

  @Patch('pay-types/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectPayType(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectPayType(id, userId);
  }

  // Pay Grades
  @Patch('pay-grades/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approvePayGrade(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approvePayGrade(id, userId);
  }

  @Patch('pay-grades/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectPayGrade(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectPayGrade(id, userId);
  }

  // Allowances
  @Patch('allowances/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approveAllowance(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approveAllowance(id, userId);
  }

  @Patch('allowances/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectAllowance(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectAllowance(id, userId);
  }

  // Insurance Brackets
  @Patch('insurance-brackets/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approveInsuranceBracket(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approveInsuranceBracket(id, userId);
  }

  @Patch('insurance-brackets/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectInsuranceBracket(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectInsuranceBracket(id, userId);
  }

  // Tax Rules
  @Patch('tax-rules/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approveTaxRule(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approveTaxRule(id, userId);
  }

  @Patch('tax-rules/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectTaxRule(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectTaxRule(id, userId);
  }

  // Benefits
  @Patch('benefits/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approveBenefit(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approveBenefit(id, userId);
  }

  @Patch('benefits/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectBenefit(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectBenefit(id, userId);
  }

  // Signing Bonuses
  @Patch('signing-bonuses/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approveSigningBonus(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approveSigningBonus(id, userId);
  }

  @Patch('signing-bonuses/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectSigningBonus(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectSigningBonus(id, userId);
  }

  // Payroll Policies
  @Patch('policies/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  approvePayrollPolicy(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.approvePayrollPolicy(id, userId);
  }

  @Patch('policies/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  rejectPayrollPolicy(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.payrollService.rejectPayrollPolicy(id, userId);
  }

  // Get all pending configurations for approval dashboard
  @Get('pending-approvals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.PAYROLL_MANAGER, SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
  getPendingApprovals() {
    return this.payrollService.getAllPendingConfigurations();
  }
}
