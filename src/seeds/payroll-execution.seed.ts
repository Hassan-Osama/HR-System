import mongoose from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { payrollRuns } from '../payroll-execution/models/payrollRuns.schema';
import { employeePayrollDetailsSchema } from '../payroll-execution/models/employeePayrollDetails.schema';
import { employeePenaltiesSchema } from '../payroll-execution/models/employeePenalties.schema';
import { employeeSigningBonusSchema } from '../payroll-execution/models/EmployeeSigningBonus.schema';
import { EmployeeTerminationResignationSchema } from '../payroll-execution/models/EmployeeTerminationResignation.schema';
import { paySlipSchema } from '../payroll-execution/models/payslip.schema';
import {
  PayRollStatus,
  PayRollPaymentStatus,
  BankStatus,
  PaySlipPaymentStatus,
  BonusStatus,
  BenefitStatus,
} from '../payroll-execution/enums/payroll-execution-enum';
import { ConfigStatus } from '../payroll-configuration/enums/payroll-configuration-enums';
import { EmployeeProfileSchema } from '../employee-profile/models/employee-profile.schema';

const payrollRunsSchema = SchemaFactory.createForClass(payrollRuns);

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = { alice: SeedRef; bob: SeedRef; charlie: SeedRef };
type SeedBonus = SeedRef & { amount: number };
type SeedBenefit = SeedRef & { amount: number };
type SeedPayrollConfig = {
  bonuses: { seniorSigningBonus: SeedBonus };
  benefits: { endOfService: SeedBenefit };
};
type RecruitmentData = { terminationRequest?: SeedRef };

export async function seedPayrollExecution(
  connection: mongoose.Connection,
  employees: SeedEmployees,
  payrollConfig: SeedPayrollConfig,
  recruitmentData?: RecruitmentData,
) {
  const PayrollRunsModel = connection.model('payrollRuns', payrollRunsSchema);
  const EmployeePayrollDetailsModel = connection.model(
    'employeePayrollDetails',
    employeePayrollDetailsSchema,
  );
  const EmployeePenaltiesModel = connection.model(
    'employeePenalties',
    employeePenaltiesSchema,
  );
  const EmployeeSigningBonusModel = connection.model(
    'employeeSigningBonus',
    employeeSigningBonusSchema,
  );
  const EmployeeTerminationResignationModel = connection.model(
    'EmployeeTerminationResignation',
    EmployeeTerminationResignationSchema,
  );
  const EmployeeProfileModel = connection.model(
    'EmployeeProfile',
    EmployeeProfileSchema,
  );
  const PaySlipModel = connection.model('paySlip', paySlipSchema);
  const ensureRun = async (
    runId: string,
    status: PayRollStatus,
    paymentStatus: PayRollPaymentStatus,
    meta: Partial<{
      payrollPeriod: Date;
      entity: string;
      employees: number;
      exceptions: number;
      totalnetpay: number;
      payrollSpecialistId: mongoose.Types.ObjectId;
      payrollManagerId?: mongoose.Types.ObjectId;
      financeStaffId?: mongoose.Types.ObjectId;
      rejectionReason?: string;
      unlockReason?: string;
      managerApprovalDate?: Date;
      financeApprovalDate?: Date;
    }> = {},
  ) => {
    const defaults = {
      payrollPeriod: meta.payrollPeriod || new Date('2025-01-31'),
      entity: meta.entity || 'Tech Corp',
      employees: meta.employees ?? 50,
      exceptions: meta.exceptions ?? 0,
      totalnetpay: meta.totalnetpay ?? 500000,
      payrollSpecialistId:
        meta.payrollSpecialistId || employees.alice?._id || employees.bob._id,
      payrollManagerId: meta.payrollManagerId,
      financeStaffId: meta.financeStaffId,
      rejectionReason: meta.rejectionReason,
      unlockReason: meta.unlockReason,
      managerApprovalDate: meta.managerApprovalDate,
      financeApprovalDate: meta.financeApprovalDate,
    };

    await PayrollRunsModel.updateOne(
      { runId },
      {
        $set: {
          runId,
          payrollPeriod: defaults.payrollPeriod,
          status,
          entity: defaults.entity,
          employees: defaults.employees,
          exceptions: defaults.exceptions,
          totalnetpay: defaults.totalnetpay,
          payrollSpecialistId: defaults.payrollSpecialistId,
          payrollManagerId: defaults.payrollManagerId,
          financeStaffId: defaults.financeStaffId,
          paymentStatus,
          rejectionReason: defaults.rejectionReason,
          unlockReason: defaults.unlockReason,
          managerApprovalDate: defaults.managerApprovalDate,
          financeApprovalDate: defaults.financeApprovalDate,
        },
      },
      { upsert: true },
    );

    return PayrollRunsModel.findOne({ runId });
  };

  const runDraft = await ensureRun(
    'PR-2025-001',
    PayRollStatus.DRAFT,
    PayRollPaymentStatus.PENDING,
  );
  const runUnderReview = await ensureRun(
    'PR-2025-UR',
    PayRollStatus.UNDER_REVIEW,
    PayRollPaymentStatus.PENDING,
  );
  const runPendingFinance = await ensureRun(
    'PR-2025-PF',
    PayRollStatus.PENDING_FINANCE_APPROVAL,
    PayRollPaymentStatus.PENDING,
  );
  const runRejected = await ensureRun(
    'PR-2025-REJ',
    PayRollStatus.REJECTED,
    PayRollPaymentStatus.PENDING,
    { rejectionReason: 'Out of budget' },
  );
  const runApprovedPaid = await ensureRun(
    'PR-2025-APR',
    PayRollStatus.APPROVED,
    PayRollPaymentStatus.PAID,
    { financeApprovalDate: new Date('2025-02-05') },
  );
  const runLocked = await ensureRun(
    'PR-2025-LOCK',
    PayRollStatus.LOCKED,
    PayRollPaymentStatus.PAID,
    { payrollManagerId: employees.alice._id },
  );
  const runUnlocked = await ensureRun(
    'PR-2025-UNLOCK',
    PayRollStatus.UNLOCKED,
    PayRollPaymentStatus.PENDING,
    { unlockReason: 'Adjustment after dispute' },
  );

  const allRuns = [
    runDraft,
    runUnderReview,
    runPendingFinance,
    runRejected,
    runApprovedPaid,
    runLocked,
    runUnlocked,
  ].filter(Boolean) as Array<mongoose.Document & { _id: mongoose.Types.ObjectId; runId: string }>;

  console.log('Payroll Runs upserted.');

  await EmployeePayrollDetailsModel.updateOne(
    { employeeId: employees.bob._id },
    {
      $setOnInsert: {
        employeeId: employees.bob._id,
        baseSalary: 15000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 16500,
        netPay: 16500,
        bankStatus: BankStatus.VALID,
        payrollRunId: runDraft?._id,
      },
    },
    { upsert: true },
  );

  await EmployeePenaltiesModel.updateOne(
    { employeeId: employees.charlie._id },
    {
      $setOnInsert: {
        employeeId: employees.charlie._id,
        penalties: [{ reason: 'Late Arrival', amount: 100 }],
      },
    },
    { upsert: true },
  );

  const hashKey = (employeeId: mongoose.Types.ObjectId, payrollRunId: mongoose.Types.ObjectId) => ({
    employeeId,
    payrollRunId,
  });

  const baseTax = { name: 'Income Tax', rate: 10, status: ConfigStatus.APPROVED };
  const insurance = {
    name: 'Health Insurance',
    status: ConfigStatus.APPROVED,
    minSalary: 0,
    maxSalary: 50000,
    employeeRate: 5,
    employerRate: 7,
  };

  const scenarios = [
    {
      key: 'bonus-only',
      paymentStatus: PaySlipPaymentStatus.PAID,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [],
          bonuses: [
            { name: 'Signing Bonus', amount: 2000, status: ConfigStatus.APPROVED },
          ],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [baseTax],
          insurances: [],
          penalties: null,
        },
      }),
    },
    {
      key: 'deduction-only',
      paymentStatus: PaySlipPaymentStatus.PENDING,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [],
          bonuses: [],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [baseTax],
          insurances: [insurance],
          penalties: null,
        },
      }),
    },
    {
      key: 'bonus-and-deductions',
      paymentStatus: PaySlipPaymentStatus.PAID,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [
            { name: 'Transport Allowance', amount: 800, status: ConfigStatus.APPROVED },
          ],
          bonuses: [
            { name: 'Performance Bonus', amount: 1200, status: ConfigStatus.APPROVED },
          ],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [baseTax],
          insurances: [insurance],
          penalties: { employeeId: employees.alice._id, penalties: [{ reason: 'Late Arrival', amount: 100 }] },
        },
      }),
    },
    {
      key: 'overtime-via-allowance',
      paymentStatus: PaySlipPaymentStatus.PENDING,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [
            { name: 'Overtime Allowance', amount: 600, status: ConfigStatus.APPROVED },
            { name: 'Night Shift Allowance', amount: 400, status: ConfigStatus.APPROVED },
          ],
          bonuses: [],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [baseTax],
          insurances: [],
          penalties: null,
        },
      }),
    },
    {
      key: 'benefit-and-refund',
      paymentStatus: PaySlipPaymentStatus.PAID,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [],
          bonuses: [],
          benefits: [
            { name: 'End of Service', amount: 1800, status: ConfigStatus.APPROVED },
          ],
          refunds: [
            { description: 'Medical refund', amount: 300 },
          ],
        },
        deductionsDetails: {
          taxes: [baseTax],
          insurances: [insurance],
          penalties: null,
        },
      }),
    },
    {
      key: 'empty-optional',
      paymentStatus: PaySlipPaymentStatus.PENDING,
      build: (baseSalary: number) => ({
        earningsDetails: {
          baseSalary,
          allowances: [],
          bonuses: [],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [],
          insurances: [],
          penalties: null,
        },
      }),
    },
  ];

  const employeesList = await EmployeeProfileModel.find({}).select({
    _id: 1,
    firstName: 1,
    lastName: 1,
    workEmail: 1,
    employeeNumber: 1,
  });

  const isBob = (emp: any) =>
    emp.firstName === 'Bob' ||
    emp.workEmail === 'bob@company.com' ||
    emp.employeeNumber === 'EMP-002';

  const targetEmployees = employeesList.filter((emp) => !isBob(emp));

  const ensurePayslip = async (
    employee: typeof employeesList[number],
    run: { _id: mongoose.Types.ObjectId; runId: string },
    scenarioIndex: number,
  ) => {
    const scenario = scenarios[scenarioIndex % scenarios.length];
    const baseSalary = 12000 + scenarioIndex * 200;
    const details = scenario.build(baseSalary);

    const allowancesArr =
      (details.earningsDetails.allowances as Array<{ amount?: number }>) || [];
    const bonusesArr =
      (details.earningsDetails.bonuses as Array<{ amount?: number }>) || [];
    const benefitsArr =
      (details.earningsDetails.benefits as Array<{ amount?: number }>) || [];

    const totalAllowances = allowancesArr.reduce(
      (sum: number, a) => sum + (a?.amount ?? 0),
      0,
    );
    const totalBonuses = bonusesArr.reduce(
      (sum: number, b) => sum + (b?.amount ?? 0),
      0,
    );
    const totalBenefits = benefitsArr.reduce(
      (sum: number, b) => sum + (b?.amount ?? 0),
      0,
    );
    const totalGrossSalary = baseSalary + totalAllowances + totalBonuses + totalBenefits;

    const taxesArr =
      (details.deductionsDetails.taxes as Array<{ rate?: number }> | undefined) ??
      [];
    const insurancesArr =
      (details.deductionsDetails.insurances as Array<{ employeeRate?: number }> | undefined) ??
      [];
    const penaltiesArr =
      (details.deductionsDetails.penalties?.penalties as Array<{ amount?: number }> | undefined) ??
      [];

    const totalTaxes = taxesArr.reduce(
      (sum: number, t) => sum + (((t?.rate ?? 0) * totalGrossSalary) / 100),
      0,
    );
    const totalInsurance = insurancesArr.reduce(
      (sum: number, i) => sum + (((i?.employeeRate ?? 0) * totalGrossSalary) / 100),
      0,
    );
    const penaltiesAmount = penaltiesArr.reduce(
      (sum: number, p) => sum + (p?.amount ?? 0),
      0,
    );

    const totaDeductions = Number((totalTaxes + totalInsurance + penaltiesAmount).toFixed(2));
    const netPay = Number((totalGrossSalary - totaDeductions).toFixed(2));

    await PaySlipModel.updateOne(
      hashKey(employee._id as mongoose.Types.ObjectId, run._id),
      {
        $set: {
          employeeId: employee._id,
          payrollRunId: run._id,
          earningsDetails: details.earningsDetails,
          deductionsDetails: details.deductionsDetails,
          totalGrossSalary,
          totaDeductions,
          netPay,
          paymentStatus: scenario.paymentStatus,
        },
      },
      { upsert: true },
    );

    const updated = await PaySlipModel.findOne(
      hashKey(employee._id as mongoose.Types.ObjectId, run._id),
    );

    return {
      identifier: `${employee.employeeNumber || employee._id.toString()}-${run.runId}`,
      doc: updated as SeedRef,
    };
  };

  console.log('Seeding Payslips for all employees except Bob...');
  const coverageIds: string[] = [];
  let bobPayslipDoc: SeedRef | undefined;
  let scenarioIdx = 0;
  for (const emp of targetEmployees) {
    const run = allRuns[scenarioIdx % allRuns.length];
    const { identifier } = await ensurePayslip(emp, run, scenarioIdx);
    coverageIds.push(identifier);
    scenarioIdx += 1;
  }

  const bobResult = await ensurePayslip(
    employeesList.find(isBob)!,
    runDraft!,
    0,
  );
  bobPayslipDoc = bobResult.doc;

  console.log('Payslips upserted.');

  await EmployeeSigningBonusModel.updateOne(
    { employeeId: employees.bob._id },
    {
      $setOnInsert: {
        employeeId: employees.bob._id,
        signingBonusId: payrollConfig.bonuses.seniorSigningBonus._id,
        givenAmount: payrollConfig.bonuses.seniorSigningBonus.amount,
        paymentDate: new Date('2025-02-28'),
        status: BonusStatus.APPROVED,
      },
    },
    { upsert: true },
  );

  const terminationBenefit = recruitmentData?.terminationRequest
    ? ((await EmployeeTerminationResignationModel.updateOne(
        { employeeId: employees.charlie._id },
        {
          $setOnInsert: {
            employeeId: employees.charlie._id,
            benefitId: payrollConfig.benefits.endOfService._id,
            givenAmount: payrollConfig.benefits.endOfService.amount,
            terminationId: recruitmentData.terminationRequest._id,
            status: BenefitStatus.PENDING,
          },
        },
        { upsert: true },
      )) as unknown as SeedRef)
    : undefined;

  return { janRun: runDraft, bobPayslip: bobPayslipDoc, signingBonusGrant: undefined, terminationBenefit };
}
