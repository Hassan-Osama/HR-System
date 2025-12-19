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
import { TerminationRequestSchema } from '../recruitment/models/termination-request.schema';
import { TerminationInitiation } from '../recruitment/enums/termination-initiation.enum';
import { TerminationStatus } from '../recruitment/enums/termination-status.enum';

const payrollRunsSchema = SchemaFactory.createForClass(payrollRuns);

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = {
  alice: SeedRef;
  bob: SeedRef;
  charlie: SeedRef;
  kevin?: SeedRef;
  lina?: SeedRef;
  sarah?: SeedRef;
  samir?: SeedRef;
};
type SeedBonus = SeedRef & { amount: number; positionName?: string };
type SeedBenefit = SeedRef & { amount: number; name?: string; terms?: string };
type SeedPayrollConfig = {
  bonuses: { seniorSigningBonus: SeedBonus };
  benefits: { endOfService: SeedBenefit };
};
type RecruitmentData = {
  terminationRequest?: SeedRef & { contractId?: mongoose.Types.ObjectId };
  contract?: SeedRef;
};

type EmployeeDoc = mongoose.Document & {
  _id: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  employeeNumber?: string;
  workEmail?: string;
};

type PayrollRow = {
  employee: EmployeeDoc;
  baseSalary: number;
  allowances: Array<{ name: string; amount: number; status: ConfigStatus }>;
  bonuses: Array<{
    _id?: mongoose.Types.ObjectId;
    positionName: string;
    amount: number;
    status: ConfigStatus;
  }>;
  benefits: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    amount: number;
    status: ConfigStatus;
    terms?: string;
  }>;
  penalties: Array<{ reason: string; amount: number }>;
  bankStatus: BankStatus;
  exceptions?: string;
  taxRate: number;
};

const employeeIdentifiers: Record<
  keyof SeedEmployees,
  { employeeNumber: string; workEmail?: string; firstName?: string }
> = {
  alice: {
    employeeNumber: 'EMP-001',
    workEmail: 'alice@company.com',
    firstName: 'Alice',
  },
  bob: {
    employeeNumber: 'EMP-002',
    workEmail: 'bob@company.com',
    firstName: 'Bob',
  },
  charlie: {
    employeeNumber: 'EMP-003',
    workEmail: 'charlie@company.com',
    firstName: 'Charlie',
  },
  kevin: {
    employeeNumber: 'EMP-010',
    workEmail: 'kevin@company.com',
    firstName: 'Kevin',
  },
  lina: {
    employeeNumber: 'EMP-011',
    workEmail: 'lina@company.com',
    firstName: 'Lina',
  },
  sarah: {
    employeeNumber: 'EMP-014',
    workEmail: 'sarah.senior.swe@company.com',
    firstName: 'Sarah',
  },
  samir: {
    employeeNumber: 'EMP-015',
    workEmail: 'samir.sales.lead@company.com',
    firstName: 'Samir',
  },
};

const toCurrency = (value: number) => Number(value.toFixed(2));
const sumAmounts = (items: Array<{ amount?: number }> = []) =>
  items.reduce((sum, item) => sum + (item?.amount ?? 0), 0);

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
  const TerminationRequestModel = connection.model(
    'TerminationRequest',
    TerminationRequestSchema,
  );

  const resolveEmployee = async (
    key: keyof SeedEmployees,
  ): Promise<EmployeeDoc> => {
    const preferredId = employees?.[key]?._id;
    const identifier = employeeIdentifiers[key];
    const orQueries = [
      { employeeNumber: identifier.employeeNumber },
      identifier.workEmail ? { workEmail: identifier.workEmail } : undefined,
      identifier.firstName ? { firstName: identifier.firstName } : undefined,
    ].filter(Boolean) as mongoose.FilterQuery<unknown>[];

    // Idempotent, safe employee resolution with stable identifiers.
    const existing = preferredId
      ? await EmployeeProfileModel.findOne({ _id: preferredId })
      : null;
    if (existing) return existing as EmployeeDoc;

    const resolved = await EmployeeProfileModel.findOne({ $or: orQueries });
    if (!resolved) {
      throw new Error(`Missing employee data for ${key}; cannot seed payroll.`);
    }
    return resolved as unknown as EmployeeDoc;
  };

  const ensureTerminationRequest = async (
    employeeId: mongoose.Types.ObjectId,
    defaultStatus: TerminationStatus,
  ) => {
    const contractId =
      recruitmentData?.terminationRequest?.contractId ||
      recruitmentData?.contract?._id ||
      recruitmentData?.terminationRequest?._id;

    if (!contractId) {
      throw new Error(
        'Missing contract/termination request to create terminationId.',
      );
    }

    const existing = await TerminationRequestModel.findOne({ employeeId });
    if (existing) return existing;

    // terminationId handling: create tied to an existing contract to satisfy required ref.
    return TerminationRequestModel.create({
      employeeId,
      initiator: TerminationInitiation.HR,
      reason: 'Payroll January 2025 settlement check',
      status: defaultStatus,
      terminationDate: new Date('2025-01-31'),
      contractId,
    });
  };

  console.log('Clearing Payroll Execution collections...');
  await Promise.all([
    PayrollRunsModel.deleteMany({}),
    EmployeePayrollDetailsModel.deleteMany({}),
    EmployeePenaltiesModel.deleteMany({}),
    EmployeeSigningBonusModel.deleteMany({}),
    EmployeeTerminationResignationModel.deleteMany({}),
    PaySlipModel.deleteMany({}),
  ]);

  const bob = await resolveEmployee('bob');
  const charlie = await resolveEmployee('charlie');
  const kevin = await resolveEmployee('kevin');
  const lina = await resolveEmployee('lina');
  const sarah = await resolveEmployee('sarah');
  const samir = await resolveEmployee('samir');

  const baseAllowanceHousing = {
    name: 'Housing Allowance',
    amount: 2000,
    status: ConfigStatus.APPROVED,
  };
  const baseAllowanceTransport = {
    name: 'Transport Allowance',
    amount: 1000,
    status: ConfigStatus.APPROVED,
  };
  const incomeTaxRule = {
    name: 'Income Tax',
    rate: 10,
    status: ConfigStatus.APPROVED,
  };

  const runId = 'PR-2025-001';
  await PayrollRunsModel.updateOne(
    { runId },
    {
      $set: {
        runId,
        payrollPeriod: new Date('2025-01-31'),
        status: PayRollStatus.DRAFT,
        entity: 'Tech Corp',
        employees: 0,
        exceptions: 0,
        totalnetpay: 0,
        payrollSpecialistId: bob._id,
        paymentStatus: PayRollPaymentStatus.PENDING,
      },
    },
    { upsert: true },
  );
  const payrollRun = (await PayrollRunsModel.findOne({ runId }))!;

  const signingBonusForSlip = {
    _id: payrollConfig.bonuses.seniorSigningBonus._id,
    positionName:
      payrollConfig.bonuses.seniorSigningBonus.positionName ||
      'Senior Developer',
    amount: payrollConfig.bonuses.seniorSigningBonus.amount,
    status: ConfigStatus.APPROVED,
  };

  const endOfServiceBenefit = {
    _id: payrollConfig.benefits.endOfService._id,
    name: payrollConfig.benefits.endOfService.name || 'End of Service Gratuity',
    amount: payrollConfig.benefits.endOfService.amount,
    status: ConfigStatus.APPROVED,
    terms: payrollConfig.benefits.endOfService.terms,
  };

  const payrollRows: PayrollRow[] = [
    {
      employee: charlie,
      baseSalary: 9000,
      allowances: [baseAllowanceHousing, baseAllowanceTransport],
      bonuses: [],
      benefits: [endOfServiceBenefit],
      penalties: [
        { reason: 'Late arrival', amount: 100 },
        { reason: 'Missing client follow-up', amount: 250 },
      ],
      bankStatus: BankStatus.MISSING,
      exceptions: 'Missing bank account; includes end-of-service benefit',
      taxRate: 10,
    },
    {
      employee: kevin,
      baseSalary: 14000,
      allowances: [baseAllowanceHousing, baseAllowanceTransport],
      bonuses: [],
      benefits: [],
      penalties: [{ reason: 'Unapproved expense claim', amount: 200 }],
      bankStatus: BankStatus.VALID,
      exceptions: 'Exception: verify allowance cap and expense dispute',
      taxRate: 10,
    },
    {
      employee: lina,
      baseSalary: 15000,
      allowances: [baseAllowanceHousing, baseAllowanceTransport],
      bonuses: [signingBonusForSlip],
      benefits: [],
      penalties: [],
      bankStatus: BankStatus.VALID,
      taxRate: 10,
    },
    {
      employee: sarah,
      baseSalary: 18000,
      allowances: [baseAllowanceHousing, baseAllowanceTransport],
      bonuses: [],
      benefits: [],
      penalties: [{ reason: 'Late timesheet submission', amount: 150 }],
      bankStatus: BankStatus.VALID,
      taxRate: 10,
    },
    {
      employee: samir,
      baseSalary: 12000,
      allowances: [baseAllowanceHousing, baseAllowanceTransport],
      bonuses: [],
      benefits: [],
      penalties: [{ reason: 'Policy violation warning', amount: 120 }],
      bankStatus: BankStatus.VALID,
      taxRate: 10,
    },
  ];

  let totalNetPay = 0;
  const exceptionsCount = payrollRows.filter((row) => row.exceptions).length;
  const payslips: Array<{
    _id: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
  }> = [];
  let bobPayslip: SeedRef | undefined;

  for (const row of payrollRows) {
    const totalAllowances = sumAmounts(row.allowances);
    const totalBonuses = sumAmounts(row.bonuses);
    const totalBenefits = sumAmounts(row.benefits);
    const gross =
      row.baseSalary + totalAllowances + totalBonuses + totalBenefits;
    const taxAmount = toCurrency((gross * row.taxRate) / 100);
    const penaltiesAmount = toCurrency(sumAmounts(row.penalties));
    const totaDeductions = toCurrency(taxAmount + penaltiesAmount);
    const netPay = toCurrency(gross - totaDeductions);

    totalNetPay += netPay;

    // Idempotent upsert of payroll details keyed by employee + run.
    await EmployeePayrollDetailsModel.updateOne(
      { employeeId: row.employee._id, payrollRunId: payrollRun._id },
      {
        $set: {
          employeeId: row.employee._id,
          baseSalary: row.baseSalary,
          allowances: totalAllowances,
          deductions: totaDeductions,
          netSalary: netPay,
          netPay,
          bankStatus: row.bankStatus,
          exceptions: row.exceptions,
          bonus: totalBonuses || undefined,
          benefit: totalBenefits || undefined,
          payrollRunId: payrollRun._id,
        },
      },
      { upsert: true },
    );

    if (row.penalties.length > 0) {
      await EmployeePenaltiesModel.updateOne(
        { employeeId: row.employee._id },
        {
          $set: {
            employeeId: row.employee._id,
            penalties: row.penalties,
          },
        },
        { upsert: true },
      );
    }

    await PaySlipModel.updateOne(
      { employeeId: row.employee._id, payrollRunId: payrollRun._id },
      {
        $set: {
          employeeId: row.employee._id,
          payrollRunId: payrollRun._id,
          earningsDetails: {
            baseSalary: row.baseSalary,
            allowances: row.allowances,
            bonuses: row.bonuses,
            benefits: row.benefits,
            refunds: [],
          },
          deductionsDetails: {
            taxes: [incomeTaxRule],
            insurances: [],
            penalties:
              row.penalties.length > 0
                ? { employeeId: row.employee._id, penalties: row.penalties }
                : undefined,
          },
          totalGrossSalary: gross,
          totaDeductions,
          netPay,
          paymentStatus: PaySlipPaymentStatus.PENDING,
        },
      },
      { upsert: true },
    );

    const updated = await PaySlipModel.findOne({
      employeeId: row.employee._id,
      payrollRunId: payrollRun._id,
    }).select({ _id: 1, employeeId: 1 });

    if (updated) {
      payslips.push({
        _id: updated._id,
        employeeId: updated.employeeId,
      });
    }
  }

  // Create a dispute-friendly payslip for Bob (not part of payrollRows totals).
  const bobBase = 13000;
  const bobGross = bobBase;
  const bobTax = toCurrency((bobGross * 10) / 100);
  const bobDeductions = bobTax;
  const bobNet = toCurrency(bobGross - bobDeductions);

  await PaySlipModel.updateOne(
    { employeeId: bob._id, payrollRunId: payrollRun._id },
    {
      $set: {
        employeeId: bob._id,
        payrollRunId: payrollRun._id,
        earningsDetails: {
          baseSalary: bobBase,
          allowances: [],
          bonuses: [],
          benefits: [],
          refunds: [],
        },
        deductionsDetails: {
          taxes: [incomeTaxRule],
          insurances: [],
          penalties: undefined,
        },
        totalGrossSalary: bobGross,
        totaDeductions: bobDeductions,
        netPay: bobNet,
        paymentStatus: PaySlipPaymentStatus.PENDING,
      },
    },
    { upsert: true },
  );

  const bobPayslipDoc = await PaySlipModel.findOne({
    employeeId: bob._id,
    payrollRunId: payrollRun._id,
  }).select({ _id: 1 });

  if (bobPayslipDoc) {
    bobPayslip = bobPayslipDoc as SeedRef;
  }

  await PayrollRunsModel.updateOne(
    { runId },
    {
      $set: {
        employees: payrollRows.length,
        exceptions: exceptionsCount,
        totalnetpay: toCurrency(totalNetPay),
        payrollSpecialistId: bob._id,
        paymentStatus: PayRollPaymentStatus.PENDING,
      },
    },
  );

  const signingBonusAssignments = [
    {
      employee: lina,
      status: BonusStatus.APPROVED,
      paymentDate: new Date('2025-02-28'),
    },
    { employee: kevin, status: BonusStatus.PENDING },
    { employee: charlie, status: BonusStatus.PENDING },
    { employee: bob, status: BonusStatus.REJECTED },
  ];

  for (const assignment of signingBonusAssignments) {
    const unset: Record<string, unknown> = {};
    if (!assignment.paymentDate) {
      unset.paymentDate = '';
    }

    await EmployeeSigningBonusModel.updateOne(
      {
        employeeId: assignment.employee._id,
        signingBonusId: payrollConfig.bonuses.seniorSigningBonus._id,
      },
      {
        $set: {
          employeeId: assignment.employee._id,
          signingBonusId: payrollConfig.bonuses.seniorSigningBonus._id,
          givenAmount: payrollConfig.bonuses.seniorSigningBonus.amount,
          paymentDate: assignment.paymentDate,
          status: assignment.status,
        },
        ...(assignment.paymentDate ? {} : { $unset: unset }),
      },
      { upsert: true },
    );
  }

  const terminationAssignments = [
    {
      employee: charlie,
      status: BenefitStatus.APPROVED,
      terminationId: recruitmentData?.terminationRequest?._id,
    },
    { employee: samir, status: BenefitStatus.PENDING },
    { employee: kevin, status: BenefitStatus.PENDING },
    { employee: sarah, status: BenefitStatus.REJECTED },
  ];

  for (const assignment of terminationAssignments) {
    const termination =
      assignment.terminationId ||
      (await ensureTerminationRequest(
        assignment.employee._id,
        TerminationStatus.PENDING,
      ));

    // Idempotent upsert keyed by employee + benefit; terminationId always valid per ensureTerminationRequest.
    await EmployeeTerminationResignationModel.updateOne(
      {
        employeeId: assignment.employee._id,
        benefitId: payrollConfig.benefits.endOfService._id,
      },
      {
        $set: {
          employeeId: assignment.employee._id,
          benefitId: payrollConfig.benefits.endOfService._id,
          givenAmount: payrollConfig.benefits.endOfService.amount,
          terminationId: termination._id,
          status: assignment.status,
        },
      },
      { upsert: true },
    );
  }

  return { payrollRun, payslips, bobPayslip };
}
