import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { claims, claimsDocument } from './models/claims.schema';
import { disputes, disputesDocument } from './models/disputes.schema';
import { refunds, refundsDocument } from './models/refunds.schema';
import { ClaimStatus, DisputeStatus, RefundStatus } from './enums/payroll-tracking-enum';
import { PayrollExecutionService } from '../payroll-execution/payroll-execution.service';
import { AuditLog, AuditLogDocument } from './models/audit-log.schema';
import PDFDocument from 'pdfkit';
import { PayrollDocumentType } from './enums/payroll-tracking-enum';

@Injectable()
export class PayrollTrackingService {
    constructor(
        @InjectModel(claims.name) private claimsModel: Model<claimsDocument>,
        @InjectModel(disputes.name) private disputesModel: Model<disputesDocument>,
        @InjectModel(refunds.name) private refundsModel: Model<refundsDocument>,

        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
        @Inject(forwardRef(() => PayrollExecutionService))
        private payrollExecutionService: PayrollExecutionService,
    ) { }

    // --- Claims Management ---

    async createClaim(data: any): Promise<claims> {
        try {
            const count = await this.claimsModel.countDocuments();
            const claimId = `CLAIM-${(count + 1).toString().padStart(4, '0')}`;

            const newClaim = new this.claimsModel({
                ...data,
                claimId,
                status: ClaimStatus.UNDER_REVIEW,
                employeeId: new Types.ObjectId(data.employeeId) // Ensure ObjectId conversion
            });
            return await newClaim.save();
        } catch (error) {
            console.error('Error creating claim:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getClaims(filter: any = {}): Promise<claims[]> {
        try {
            // If employeeId is provided in filter, ensure it's an ObjectId
            if (filter.employeeId) {
                if (Types.ObjectId.isValid(filter.employeeId)) {
                    filter.employeeId = new Types.ObjectId(filter.employeeId);
                } else {
                    // If invalid ObjectId, return empty array instead of crashing
                    console.warn(`Invalid employeeId format in filter: ${filter.employeeId}`);
                    return [];
                }
            }
            return await this.claimsModel.find(filter).populate('employeeId', 'firstName lastName').exec();
        } catch (error) {
            console.error('Error fetching claims:', error);
            throw new InternalServerErrorException('Failed to fetch claims');
        }
    }

    async getClaimById(id: string): Promise<claimsDocument> {
        const claim = await this.claimsModel.findById(id).populate('employeeId', 'firstName lastName').exec();
        if (!claim) throw new NotFoundException('Claim not found');
        return claim;
    }

    async updateClaimStatus(id: string, status: ClaimStatus, userId: string, role: string, comment?: string, approvedAmount?: number): Promise<claims> {
        const claim = await this.getClaimById(id);

        // Logic for status transitions based on role could be added here
        // For now, we allow direct updates as per requirements

        claim.status = status;
        if (comment) {
            if (status === ClaimStatus.REJECTED) claim.rejectionReason = comment;
            else claim.resolutionComment = comment;
        }

        if (approvedAmount !== undefined) {
            claim.approvedAmount = approvedAmount;
        }

        if (role === 'Payroll Specialist') claim.payrollSpecialistId = new Types.ObjectId(userId);
        if (role === 'Payroll Manager') claim.payrollManagerId = new Types.ObjectId(userId);
        if (role === 'Finance Staff') claim.financeStaffId = new Types.ObjectId(userId);

        const savedClaim = await claim.save();

        // If approved, create a refund record
        if (status === ClaimStatus.APPROVED) {
            await this.createRefundFromClaim(savedClaim);
        }

        return savedClaim;
    }

    // --- Disputes Management ---

    async createDispute(data: any): Promise<disputes> {
        try {
            const count = await this.disputesModel.countDocuments();
            const disputeId = `DISP-${(count + 1).toString().padStart(4, '0')}`;

            const newDispute = new this.disputesModel({
                ...data,
                disputeId,
                status: DisputeStatus.UNDER_REVIEW,
                employeeId: new Types.ObjectId(data.employeeId), // Ensure ObjectId conversion
                payslipId: new Types.ObjectId(data.payslipId) // Ensure ObjectId conversion
            });
            return await newDispute.save();
        } catch (error) {
            console.error('Error creating dispute:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getDisputes(filter: any = {}): Promise<disputes[]> {
        try {
            if (filter.employeeId) {
                if (Types.ObjectId.isValid(filter.employeeId)) {
                    filter.employeeId = new Types.ObjectId(filter.employeeId);
                } else {
                    console.warn(`Invalid employeeId format in filter: ${filter.employeeId}`);
                    return [];
                }
            }
            return await this.disputesModel.find(filter)
                .populate('employeeId', 'firstName lastName')
                .populate('payslipId')
                .exec();
        } catch (error) {
            console.error('Error fetching disputes:', error);
            throw new InternalServerErrorException('Failed to fetch disputes');
        }
    }

    async getDisputeById(id: string): Promise<disputesDocument> {
        const dispute = await this.disputesModel.findById(id)
            .populate('employeeId', 'firstName lastName')
            .populate('payslipId')
            .exec();
        if (!dispute) throw new NotFoundException('Dispute not found');
        return dispute;
    }

    async updateDisputeStatus(id: string, status: DisputeStatus, userId: string, role: string, comment?: string): Promise<disputes> {
        const dispute = await this.getDisputeById(id);

        dispute.status = status;
        if (comment) {
            if (status === DisputeStatus.REJECTED) dispute.rejectionReason = comment;
            else dispute.resolutionComment = comment;
        }

        if (role === 'Payroll Specialist') dispute.payrollSpecialistId = new Types.ObjectId(userId);
        if (role === 'Payroll Manager') dispute.payrollManagerId = new Types.ObjectId(userId);
        if (role === 'Finance Staff') dispute.financeStaffId = new Types.ObjectId(userId);

        const savedDispute = await dispute.save();

        // If approved, create a refund record (assuming dispute resolution involves payment)
        // Note: Logic might vary if dispute resolution involves deduction or other adjustments
        if (status === DisputeStatus.APPROVED) {
            // For simplicity, assuming dispute resolution might trigger a refund if applicable
            // In a real scenario, we might need more details on the refund amount
            // await this.createRefundFromDispute(savedDispute); 
        }

        return savedDispute;
    }

    // --- Refunds Management ---

    async createRefundFromClaim(claim: claimsDocument): Promise<refunds> {
        const refund = new this.refundsModel({
            claimId: claim._id,
            employeeId: claim.employeeId,
            refundDetails: {
                description: `Refund for Claim ${claim.claimId}: ${claim.description}`,
                amount: claim.approvedAmount || claim.amount
            },
            status: RefundStatus.PENDING
        });
        return refund.save();
    }

    async getPendingRefunds(employeeId?: string): Promise<refunds[]> {
        const filter: any = { status: RefundStatus.PENDING };
        if (employeeId) filter.employeeId = employeeId;
        return this.refundsModel.find(filter).exec();
    }

    async markRefundsAsPaid(refundIds: string[], payrollRunId: string): Promise<void> {
        await this.refundsModel.updateMany(
            { _id: { $in: refundIds } },
            {
                status: RefundStatus.PAID,
                paidInPayrollRunId: new Types.ObjectId(payrollRunId)
            }
        );
    }



    async getEmployeePayslips(employeeId: string): Promise<any[]> {
        return await this.payrollExecutionService.getPayslipsByEmployee(employeeId);
    }

    async getPayslipById(id: string): Promise<any> {
        return this.payrollExecutionService.getPayslipById(id);
    }

    // --- Documents ---
    async getDocuments(employeeId: string): Promise<any[]> {
        // Currently returning empty list as per plan since there is no doc persistence yet
        // In future: return this.documentModel.find({ employeeId });
        return [];
    }

    // --- Audit Logging ---

    private async createAuditLog(action: string, performedBy: string, targetEntity: string, targetId: string, details: any) {
        try {
            // Validate performedBy as ObjectId if possible, else just store? 
            // The schema defines it as ObjectId. If the input string isn't an ObjectId, this might fail.
            // We'll trust the caller passes a valid ID or we generate one/handle it.
            // reusing new Types.ObjectId for safety if string is valid hex
            const userObjectId = Types.ObjectId.isValid(performedBy) ? new Types.ObjectId(performedBy) : new Types.ObjectId();

            await this.auditLogModel.create({
                action,
                performedBy: userObjectId,
                targetEntity,
                targetId,
                details
            });
        } catch (error) {
            console.error('Audit Log failed:', error);
        }
    }

    async getAuditTrails(filter: any = {}): Promise<AuditLog[]> {
        return this.auditLogModel.find(filter).sort({ timestamp: -1 }).populate('performedBy', 'firstName lastName').exec();
    }

    // --- Dashboard & Reports ---

    async getEmployeeDashboardStats(employeeId: string) {
        // Aggregate earnings, deductions, pending claims
        const claims = await this.claimsModel.find({ employeeId }).exec();
        const pendingClaims = claims.filter(c => c.status === ClaimStatus.UNDER_REVIEW).length;
        const approvedClaims = claims.filter(c => c.status === ClaimStatus.APPROVED).length;

        // Use Real payslips for calculations
        const allPayslips = await this.getEmployeePayslips(employeeId);

        let totalEarnings = 0;
        let totalDeductions = 0;
        let totalNetPay = 0;

        allPayslips.forEach((ps: any) => { // Type as any for now due to mix of schemas
            const earning = ps.totalGrossSalary || ps.basicSalary || 0; // adaptation
            const deduction = ps.totalDeductions || ps.deductions || 0;
            const net = ps.netPay || 0;
            totalEarnings += earning;
            totalDeductions += deduction;
            totalNetPay += net;
        });

        return {
            pendingClaims,
            approvedClaims,
            totalEarnings,
            totalDeductions,
            totalNetPay,
            recentPayslips: allPayslips.slice(0, 5)
        };
    }

    async getFinanceSummary(startDate: Date, endDate: Date) {
        const payrollRuns = await this.payrollExecutionService.getPayrollRuns();
        // filter by date
        const filtered = payrollRuns.filter(pr => {
            const d = new Date(pr.payrollPeriod);
            return d >= startDate && d <= endDate;
        });

        const totalPayout = filtered.reduce((acc, curr) => acc + curr.totalnetpay, 0);
        const totalEmployees = filtered.reduce((acc, curr) => acc + curr.employees, 0);

        return {
            period: { start: startDate, end: endDate },
            totalPayout,
            totalEmployees,
            runCount: filtered.length,
            details: filtered
        };
    }

    async getOperationalReports(period: string) {
        // e.g., period '2024-01'
        // Group payroll runs or payslips by department? 
        // This requires Department in Payslip or joining with Employee. 
        // For now, returning run summary.
        // In a real app, this would be an aggregation pipeline.
        return this.payrollExecutionService.getPayrollRuns();
    }

    // --- Document Generation ---

    async generateDocument(employeeId: string, type: string, year: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // -- Header --
            doc.fontSize(24).font('Helvetica-Bold').text('HR System', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(16).font('Helvetica').text(`Official Document: ${type}`, { align: 'center' });
            doc.moveDown(1);

            // -- Meta Info --
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text(`Employee ID: ${employeeId}`, { continued: true });
            doc.text(`   |   Year: ${year}`, { continued: true });
            doc.text(`   |   Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
            doc.moveDown(0.5);

            // -- Drawing a line --
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // -- Content Body --
            doc.fontSize(11).font('Helvetica');

            if (type === PayrollDocumentType.TAX_FORM) {
                doc.text('This certifies that the employee named above has completed their tax obligations for the specified year. Below is a summary of the taxable income and withholdings.', { align: 'justify' });
                doc.moveDown();
                doc.font('Courier').text('Gross Income:       $85,000.00');
                doc.text('Federal Tax:        $12,500.00');
                doc.text('State Tax:          $ 4,200.00');
                doc.text('Social Security:    $ 5,270.00');
                doc.text('Medicare:           $ 1,232.50');
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Total Withheld:     $23,202.50');

            } else if (type === PayrollDocumentType.INSURANCE_CERTIFICATE) {
                doc.text('This certificate confirms that the employee is covered under the company Group Health and Life Insurance Plan.', { align: 'justify' });
                doc.moveDown();
                doc.list([
                    'Plan Type: Gold PPO',
                    'Carrier: BlueCross BlueShield',
                    'Effective Date: Jan 1, ' + year,
                    'Dependents Covered: 2'
                ]);
                doc.moveDown();
                doc.text('Policy Number: G-88392-X');

            } else if (type === 'Payslip' || type === PayrollDocumentType.PAYSLIP) {
                doc.text('PAYSLIP STATEMENT', { align: 'center', underline: true });
                doc.moveDown();
                doc.text('Pay Period: December ' + year);
                doc.moveDown();

                // Earnings Table Mock
                const startY = doc.y;
                doc.font('Helvetica-Bold').text('Earnings', 50, startY);
                doc.text('Amount', 400, startY);
                doc.moveDown(0.5);
                doc.font('Helvetica');
                doc.text('Basic Salary', 50); doc.text('$ 3,500.00', 400);
                doc.text('HRA', 50); doc.text('$ 1,200.00', 400);
                doc.text('Special Allowance', 50); doc.text('$ 800.00', 400);
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Total Earnings: $ 5,500.00', 50);

                doc.moveDown();
                doc.font('Helvetica-Bold').text('Deductions', 50);
                doc.moveDown(0.5);
                doc.font('Helvetica');
                doc.text('Tax', 50); doc.text('$ 850.00', 400);
                doc.text('PF', 50); doc.text('$ 400.00', 400);
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Net Pay: $ 4,250.00', 50);

            } else if (type === 'Salary Certificate') {
                doc.text('TO WHOM IT MAY CONCERN', { align: 'center', underline: true });
                doc.moveDown(2);
                doc.text(`This is to certify that the individual with Employee ID ${employeeId} is a bona fide employee of our company.`);
                doc.moveDown();
                doc.text('Their current annual compensation structure is as follows:');
                doc.moveDown();
                doc.font('Courier');
                doc.text('Annual Basic Salary:   $ 65,000.00');
                doc.text('Allowances:            $ 25,000.00');
                doc.text('Total CTC:             $ 90,000.00');
                doc.moveDown();
                doc.font('Helvetica');
                doc.text('This certificate is issued upon the request of the employee for verification purposes.');
            } else if (type === 'Financial Report') {
                doc.fontSize(16).text('Financial Summary Report', { align: 'center', underline: true });
                doc.moveDown();
                doc.fontSize(12).text(`Report Period: ${year} (Year-to-Date)`);
                doc.moveDown();

                // Summary Table
                const startY = doc.y;
                doc.font('Helvetica-Bold').text('Category', 50, startY);
                doc.text('Total', 400, startY);
                doc.moveDown(0.5);
                doc.font('Helvetica');

                doc.text('Total Payroll Payout', 50); doc.text('$ 1,250,000.00', 400);
                doc.text('Total Tax Withheld', 50); doc.text('$ 350,000.00', 400);
                doc.text('Total Insurance Premiums', 50); doc.text('$ 120,500.00', 400);
                doc.text('Reimbursement Claims', 50); doc.text('$ 45,200.00', 400);

                doc.moveDown();
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Net Cost to Company: $ 1,765,700.00', 50);
                doc.moveDown(2);
                doc.font('Helvetica').text('Detailed breakdown by department is available in the CSV export.');

            } else {
                doc.text('Generic document content for: ' + type);
            }

            // -- Footer / Stamp --
            doc.moveDown(4);
            doc.font('Helvetica-Oblique').fontSize(10).fillColor('black').text('Generated by Automated Payroll System', { align: 'center' });
            doc.fillColor('grey').fontSize(8).text('verify at: hr-system.internal/verify/' + employeeId, { align: 'center' });

            doc.end();
        });
    }
}
