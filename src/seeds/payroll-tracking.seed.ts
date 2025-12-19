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
type SeedEmployees = { alice: SeedRef; bob: SeedRef };
type SeedPayrollExecution = Partial<{
  bobPayslip: SeedRef;
  payrollRun: SeedRef;
  payslips: Array<{ _id: mongoose.Types.ObjectId; employeeId: mongoose.Types.ObjectId }>;
}>;

export async function seedPayrollTracking(
  connection: mongoose.Connection,
  employees: SeedEmployees,
  payrollExecution?: SeedPayrollExecution,
) {
  const ClaimsModel = connection.model('claims', claimsSchema);
  const DisputesModel = connection.model('disputes', disputesSchema);
  const RefundsModel = connection.model('refunds', refundsSchema);

  console.log('Clearing Payroll Tracking...');
  await ClaimsModel.deleteMany({});
  await DisputesModel.deleteMany({});
  await RefundsModel.deleteMany({});

  console.log('Seeding Claims...');
  const medicalClaim = await ClaimsModel.create({
    claimId: 'CLAIM-001',
    description: 'Medical reimbursement for dental checkup',
    claimType: 'Medical',
    employeeId: employees.bob._id,
    amount: 500,
    status: ClaimStatus.UNDER_REVIEW,
  });
  console.log('Claims seeded.');

  console.log('Seeding Disputes...');
  const bobPayslipId =
    payrollExecution?.bobPayslip?._id ||
    payrollExecution?.payslips?.find((p) => `${p.employeeId}` === `${employees.bob._id}`)?._id;

  if (bobPayslipId) {
    await DisputesModel.create({
      disputeId: 'DISP-001',
      description: 'Incorrect tax calculation',
      employeeId: employees.bob._id,
      payslipId: bobPayslipId,
      status: DisputeStatus.UNDER_REVIEW,
    });
    console.log('Disputes seeded.');
  } else {
    console.log('Skipping Disputes (requires Payslip).');
  }

  console.log('Seeding Refunds...');
  await RefundsModel.create({
    claimId: medicalClaim._id,
    refundDetails: {
      description: 'Approved Medical Claim',
      amount: 500,
    },
    employeeId: employees.bob._id,
    financeStaffId: employees.alice._id,
    status: RefundStatus.PENDING,
  });
  console.log('Refunds seeded.');

  return { medicalClaim };
}
