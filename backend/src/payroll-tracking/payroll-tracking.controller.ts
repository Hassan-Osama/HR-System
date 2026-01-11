import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query, Res } from '@nestjs/common';
import { PayrollTrackingService } from './payroll-tracking.service';
import { ClaimStatus, DisputeStatus } from './enums/payroll-tracking-enum';
// Assuming AuthGuard is available, otherwise remove UseGuards
// import { AuthGuard } from '../auth/auth.guard'; 

@Controller('payroll-tracking')
export class PayrollTrackingController {
    constructor(private readonly payrollTrackingService: PayrollTrackingService) { }

    // --- Claims ---

    @Post('claims')
    async createClaim(@Body() createClaimDto: any) {
        return this.payrollTrackingService.createClaim(createClaimDto);
    }

    @Get('claims')
    async getClaims(@Query('employeeId') employeeId?: string) {
        const filter = employeeId ? { employeeId } : {};
        return this.payrollTrackingService.getClaims(filter);
    }

    @Get('claims/:id')
    async getClaimById(@Param('id') id: string) {
        return this.payrollTrackingService.getClaimById(id);
    }

    @Put('claims/:id/status')
    async updateClaimStatus(
        @Param('id') id: string,
        @Body() body: { status: ClaimStatus, userId: string, role: string, comment?: string, approvedAmount?: number }
    ) {
        return this.payrollTrackingService.updateClaimStatus(
            id,
            body.status,
            body.userId,
            body.role,
            body.comment,
            body.approvedAmount
        );
    }

    // --- Disputes ---

    @Post('disputes')
    async createDispute(@Body() createDisputeDto: any) {
        return this.payrollTrackingService.createDispute(createDisputeDto);
    }

    @Get('disputes')
    async getDisputes(@Query('employeeId') employeeId?: string) {
        const filter = employeeId ? { employeeId } : {};
        return this.payrollTrackingService.getDisputes(filter);
    }

    @Get('disputes/:id')
    async getDisputeById(@Param('id') id: string) {
        return this.payrollTrackingService.getDisputeById(id);
    }

    @Put('disputes/:id/status')
    async updateDisputeStatus(
        @Param('id') id: string,
        @Body() body: { status: DisputeStatus, userId: string, role: string, comment?: string }
    ) {
        return this.payrollTrackingService.updateDisputeStatus(
            id,
            body.status,
            body.userId,
            body.role,
            body.comment
        );
    }

    // --- Payslips ---

    @Get('payslips/employee/:employeeId')
    async getEmployeePayslips(@Param('employeeId') employeeId: string) {
        return this.payrollTrackingService.getEmployeePayslips(employeeId);
    }

    @Get('payslips/:id')
    async getPayslipById(@Param('id') id: string) {
        return this.payrollTrackingService.getPayslipById(id);
    }

    // --- Dashboard ---

    @Get('dashboard/employee/:employeeId')
    async getEmployeeDashboardStats(@Param('employeeId') employeeId: string) {
        return this.payrollTrackingService.getEmployeeDashboardStats(employeeId);
    }

    // --- Reports ---

    @Get('reports/finance')
    async getFinanceSummary(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        // Default to current year if not provided
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();
        return this.payrollTrackingService.getFinanceSummary(start, end);
    }

    @Get('reports/operational/:period')
    async getOperationalReports(@Param('period') period: string) {
        return this.payrollTrackingService.getOperationalReports(period);
    }

    // --- Audit ---

    @Get('audit/logs')
    async getAuditTrails(@Query('targetEntity') targetEntity?: string) {
        // Basic filter
        const filter = targetEntity ? { targetEntity } : {};
        return this.payrollTrackingService.getAuditTrails(filter);
    }

    // --- Documents ---

    @Post('documents/generate')
    async generateDocument(@Body() body: { employeeId: string, type: any, year: number }, @Request() req, @Res() res) { // Inject Res to stream
        const pdfBuffer = await this.payrollTrackingService.generateDocument(body.employeeId, body.type, body.year);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${body.type}-${body.year}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }

    @Get('documents')
    async getDocuments(@Query('employeeId') employeeId: string) {
        return this.payrollTrackingService.getDocuments(employeeId);
    }
}
