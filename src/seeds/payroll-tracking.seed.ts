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
type SeedEmployees = { alice: SeedRef; bob: SeedRef };
type SeedPayrollExecution = Partial<{
  bobPayslip: SeedRef;
  payrollRun: SeedRef;
  payslips: Array<{
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
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

  console.log('Seeding Claims...');
  let medicalClaim = await ClaimsModel.findOne({ claimId: 'CLAIM-001' });
  if (!medicalClaim) {
    medicalClaim = await ClaimsModel.create({
      claimId: 'CLAIM-001',
      description: 'Medical reimbursement for dental checkup',
      claimType: 'Medical',
      employeeId: employees.bob._id,
      amount: 500,
      status: ClaimStatus.UNDER_REVIEW,
    });
  }
  console.log('Claims seeded.');

  console.log('Seeding Disputes...');
  const bobPayslipId =
    payrollExecution?.bobPayslip?._id ||
    payrollExecution?.payslips?.find(
      (p) => `${p.employeeId}` === `${employees.bob._id}`,
    )?._id;

  if (!bobPayslipId) {
    throw new Error(
      'Missing Bob payslip for dispute seeding; expected from payrollExecution payload.',
    );
  }

  let bobDispute = await DisputesModel.findOne({ disputeId: 'DISP-001' });
  if (!bobDispute) {
    bobDispute = await DisputesModel.create({
      disputeId: 'DISP-001',
      description: 'Incorrect tax calculation',
      employeeId: employees.bob._id,
      payslipId: bobPayslipId,
      status: DisputeStatus.UNDER_REVIEW,
    });
  }
  console.log('Disputes seeded.');

  console.log('Seeding Claim Refunds...');
  const existingClaimRefund = await RefundsModel.findOne({
    claimId: medicalClaim._id,
  });
  if (!existingClaimRefund) {
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
  }
  console.log('Claim refunds seeded.');

  console.log('Seeding Refunds for Disputes...');
  const allDisputes = await DisputesModel.find({});
  const disputeIdList = allDisputes.map((dispute) => dispute._id);

  const existingDisputeRefunds = await RefundsModel.find({
    disputeId: { $in: disputeIdList },
  }).lean();

  const disputeRefundLookup = new Set(
    existingDisputeRefunds.map((refund) => `${refund.disputeId}`),
  );

  let disputeRefundsCreated = 0;
  for (const dispute of allDisputes) {
    if (disputeRefundLookup.has(`${dispute._id}`)) {
      continue;
    }

    await RefundsModel.create({
      disputeId: dispute._id,
      refundDetails: {
        description: `Pending dispute refund for ${
          dispute.disputeId || dispute._id
        }`,
        amount: 0,
      },
      employeeId: dispute.employeeId,
      financeStaffId: employees.alice._id,
      status: RefundStatus.PENDING,
    });

    disputeRefundLookup.add(`${dispute._id}`);
    disputeRefundsCreated += 1;
  }

  const totalDisputes = allDisputes.length;
  const disputesWithRefunds = disputeRefundLookup.size;

  const reportContent = [
    '# Dispute Refund Seed Report',
    `- Total disputes found: ${totalDisputes}`,
    `- Disputes with existing refunds: ${disputesWithRefunds - disputeRefundsCreated}`,
    `- New pending refunds created: ${disputeRefundsCreated}`,
    `- Refund status used: ${RefundStatus.PENDING}`,
  ].join('\n');

  writeFileSync(
    join(process.cwd(), 'DISPUTE_REFUND_SEED_REPORT.md'),
    `${reportContent}\n`,
  );

  console.log('Dispute refunds seeded.');

  return {
    medicalClaim,
    disputeRefundsCreated,
    disputesWithRefunds,
    totalDisputes,
  };
}
