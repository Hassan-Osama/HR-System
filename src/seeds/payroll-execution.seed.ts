import mongoose from 'mongoose';
import { payrollRuns } from '../payroll-execution/models/payrollRuns.schema';
import { employeePayrollDetailsSchema } from '../payroll-execution/models/employeePayrollDetails.schema';
import { employeePenaltiesSchema } from '../payroll-execution/models/employeePenalties.schema';
import { employeeSigningBonusSchema } from '../payroll-execution/models/EmployeeSigningBonus.schema';
import { EmployeeTerminationResignationSchema } from '../payroll-execution/models/EmployeeTerminationResignation.schema';
import { paySlipSchema } from '../payroll-execution/models/payslip.schema';
import { SchemaFactory } from '@nestjs/mongoose';
import {
  PayRollStatus,
  PayRollPaymentStatus,
  BankStatus,
  PaySlipPaymentStatus,
  BonusStatus,
  BenefitStatus,
} from '../payroll-execution/enums/payroll-execution-enum';
import { ConfigStatus } from '../payroll-configuration/enums/payroll-configuration-enums';

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
  const PaySlipModel = connection.model('paySlip', paySlipSchema);

  console.log('Clearing Payroll Execution...');
  await PayrollRunsModel.deleteMany({});
  await EmployeePayrollDetailsModel.deleteMany({});
  await EmployeePenaltiesModel.deleteMany({});
  await EmployeeSigningBonusModel.deleteMany({});
  await EmployeeTerminationResignationModel.deleteMany({});
  await PaySlipModel.deleteMany({});

  console.log('Seeding Payroll Runs...');
  const janRun = await PayrollRunsModel.create({
    runId: 'PR-2025-001',
    payrollPeriod: new Date('2025-01-31'),
    status: PayRollStatus.DRAFT,
    entity: 'Tech Corp',
    employees: 50,
    exceptions: 2,
    totalnetpay: 500000,
    payrollSpecialistId: employees.alice._id,
    paymentStatus: PayRollPaymentStatus.PENDING,
    payrollManagerId: employees.alice._id,
  });
  console.log('Payroll Runs seeded.');

  console.log('Seeding Employee Payroll Details...');
  await EmployeePayrollDetailsModel.create({
    employeeId: employees.bob._id,
    baseSalary: 15000,
    allowances: 3000,
    deductions: 1500,
    netSalary: 16500,
    netPay: 16500,
    bankStatus: BankStatus.VALID,
    payrollRunId: janRun._id,
  });
  console.log('Employee Payroll Details seeded.');

  console.log('Seeding Employee Penalties...');
  await EmployeePenaltiesModel.create({
    employeeId: employees.charlie._id,
    penalties: [{ reason: 'Late Arrival', amount: 100 }],
  });
  console.log('Employee Penalties seeded.');

  console.log('Seeding Payslips...');
  const bobPayslip = await PaySlipModel.create({
    employeeId: employees.bob._id,
    payrollRunId: janRun._id,
    earningsDetails: {
      baseSalary: 15000,
      allowances: [
        {
          name: 'Housing Allowance',
          amount: 2000,
          status: ConfigStatus.APPROVED,
        },
        {
          name: 'Transport Allowance',
          amount: 1000,
          status: ConfigStatus.APPROVED,
        },
      ],
      bonuses: [],
      benefits: [],
      refunds: [],
    },
    deductionsDetails: {
      taxes: [{ name: 'Income Tax', rate: 10, status: ConfigStatus.APPROVED }],
      insurances: [],
      penalties: null,
    },
    totalGrossSalary: 18000,
    totaDeductions: 1500,
    netPay: 16500,
    paymentStatus: PaySlipPaymentStatus.PENDING,
  });
  console.log('Payslips seeded.');

  console.log('Seeding Employee Signing Bonuses...');
  const signingBonusGrant = await EmployeeSigningBonusModel.create({
    employeeId: employees.bob._id,
    signingBonusId: payrollConfig.bonuses.seniorSigningBonus._id,
    givenAmount: payrollConfig.bonuses.seniorSigningBonus.amount,
    paymentDate: new Date('2025-02-28'),
    status: BonusStatus.APPROVED,
  });

  console.log('Seeding Termination Benefits...');
  const terminationBenefit = recruitmentData?.terminationRequest
    ? ((await EmployeeTerminationResignationModel.create({
        employeeId: employees.charlie._id,
        benefitId: payrollConfig.benefits.endOfService._id,
        givenAmount: payrollConfig.benefits.endOfService.amount,
        terminationId: recruitmentData.terminationRequest._id,
        status: BenefitStatus.PENDING,
      })) as SeedRef)
    : undefined;

  return { janRun, bobPayslip, signingBonusGrant, terminationBenefit };
}
