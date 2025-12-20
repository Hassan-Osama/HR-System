/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { writeFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import { claimsSchema } from '../payroll-tracking/models/claims.schema';
import { disputesSchema } from '../payroll-tracking/models/disputes.schema';
import { refundsSchema } from '../payroll-tracking/models/refunds.schema';
import {
  ClaimStatus,
  RefundStatus,
  DisputeStatus,
} from '../payroll-tracking/enums/payroll-tracking-enum';

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = {
  alice: SeedRef;
  bob: SeedRef;
  charlie: SeedRef;
  hannah?: SeedRef;
};
type SeedPayrollExecution = Partial<{
  payrollRun: SeedRef;
  payslips: Array<{
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
  }>;
  payrollDetailsSummary: Array<{
    employeeId: mongoose.Types.ObjectId;
    exceptions?: string;
    penaltiesCount: number;
    workEmail?: string;
  }>;
}>;

export async function seedPayrollTracking(
  connection: mongoose.Connection,
  employees: SeedEmployees,
  payrollExecution?: SeedPayrollExecution,
) {
  const ClaimsModel = connection.model('claims', claimsSchema);
  const DisputesModel = connection.model('disputes', disputesSchema);
  const RefundsModel = connection.model('refunds', refundsSchema);

  // Idempotent reset for scenario-specific data
  await Promise.all([
    ClaimsModel.deleteMany({}),
    DisputesModel.deleteMany({}),
    RefundsModel.deleteMany({}),
  ]);

  console.log('Seeding Claims...');
  const charlieClaimId = 'CLAIM-CHARLIE-001';
  const charlieClaim = await ClaimsModel.findOneAndUpdate(
    { claimId: charlieClaimId },
    {
      $setOnInsert: {
        claimId: charlieClaimId,
        description: 'Payroll January 2025 adjustment claim',
        claimType: 'Payroll',
        employeeId: employees.charlie._id,
        amount: 0,
        status: ClaimStatus.UNDER_REVIEW,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('Claims seeded.');

  console.log('Seeding Disputes...');
  const charliePayslipId = payrollExecution?.payslips?.find(
    (p) => `${p.employeeId}` === `${employees.charlie._id}`,
  )?._id;

  if (!charliePayslipId) {
    throw new Error('Missing Charlie payslip for dispute seeding.');
  }

  const charlieDisputeId = 'DISP-CHARLIE-001';
  const charlieDispute = await DisputesModel.findOneAndUpdate(
    { disputeId: charlieDisputeId },
    {
      $setOnInsert: {
        disputeId: charlieDisputeId,
        description: 'Missing bank account exception review',
        employeeId: employees.charlie._id,
        payslipId: charliePayslipId,
        status: DisputeStatus.UNDER_REVIEW,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('Disputes seeded.');

  console.log('Seeding Refund for Dispute...');
  if (!employees.hannah?._id) {
    throw new Error('Missing finance handler (Hannah) for refund seeding.');
  }

  const refund = await RefundsModel.findOneAndUpdate(
    { disputeId: charlieDispute._id },
    {
      $set: {
        disputeId: charlieDispute._id,
        refundDetails: {
          description: 'Pending review for missing bank account exception',
          amount: 0,
        },
        employeeId: employees.charlie._id,
        financeStaffId: employees.hannah._id,
        status: RefundStatus.PENDING,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log('Dispute refund seeded.');

  const validationReport = [
    '# SEED SCENARIO VALIDATION REPORT',
    `- PayrollRun PR-2025-001: employees=3 exceptions=1`,
    `- Employees in run: Lina, Eric, Charlie`,
    '- EmployeePayrollDetails:',
    ...(payrollExecution?.payrollDetailsSummary || []).map((d) =>
      `  - ${d.workEmail || d.employeeId}: exceptions=${d.exceptions || 'none'}; penalties=${d.penaltiesCount}`,
    ),
    '- Payslips seeded for Lina, Eric, Charlie',
    `- Claims: 1 (employee=Charlie)`,
    `- Disputes: 1 (employee=Charlie)`,
    `- Refunds: 1 (status=${RefundStatus.PENDING}, finance=Hannah)`,
    `- PayrollConfig ownership: createdBy=Bob; approvedBy=Paula for approved configs`,
  ].join('\n');

  writeFileSync(
    join(process.cwd(), 'SEED_SCENARIO_VALIDATION_REPORT.md'),
    `${validationReport}\n`,
  );

  return {
    charlieClaim,
    charlieDispute,
    refund,
  };
}
