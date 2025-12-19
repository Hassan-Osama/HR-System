import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { payGradeSchema } from '../payroll-configuration/models/payGrades.schema';
import { allowanceSchema } from '../payroll-configuration/models/allowance.schema';
import { payrollPolicies } from '../payroll-configuration/models/payrollPolicies.schema';
import { CompanyWideSettingsSchema } from '../payroll-configuration/models/CompanyWideSettings.schema';
import { insuranceBracketsSchema } from '../payroll-configuration/models/insuranceBrackets.schema';
import { payTypeSchema } from '../payroll-configuration/models/payType.schema';
import { signingBonusSchema } from '../payroll-configuration/models/signingBonus.schema';
import { taxRulesSchema } from '../payroll-configuration/models/taxRules.schema';
import { terminationAndResignationBenefitsSchema } from '../payroll-configuration/models/terminationAndResignationBenefits';
import { SchemaFactory } from '@nestjs/mongoose';
import { PositionSchema } from '../organization-structure/models/position.schema';
import {
  ConfigStatus,
  PolicyType,
  Applicability,
} from '../payroll-configuration/enums/payroll-configuration-enums';

// Need to manually create schema for payrollPolicies since it's exported as class
const payrollPoliciesSchema = SchemaFactory.createForClass(payrollPolicies);

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedEmployees = { alice: SeedRef; bob: SeedRef; charlie: SeedRef };

export async function seedPayrollConfiguration(
  connection: mongoose.Connection,
  employees: SeedEmployees,
) {
  const PayGradeModel = connection.model('payGrade', payGradeSchema);
  const PositionModel = connection.model('Position', PositionSchema);
  const AllowanceModel = connection.model('allowance', allowanceSchema);
  const PayrollPoliciesModel = connection.model(
    'payrollPolicies',
    payrollPoliciesSchema,
  );
  const CompanyWideSettingsModel = connection.model(
    'CompanyWideSettings',
    CompanyWideSettingsSchema,
  );
  const InsuranceBracketsModel = connection.model(
    'insuranceBrackets',
    insuranceBracketsSchema,
  );
  const PayTypeModel = connection.model('payType', payTypeSchema);
  const SigningBonusModel = connection.model(
    'signingBonus',
    signingBonusSchema,
  );
  const TaxRulesModel = connection.model('taxRules', taxRulesSchema);
  const TerminationBenefitsModel = connection.model(
    'terminationAndResignationBenefits',
    terminationAndResignationBenefitsSchema,
  );

  console.log('Clearing Payroll Configuration...');
  await AllowanceModel.deleteMany({});
  await PayrollPoliciesModel.deleteMany({});
  await CompanyWideSettingsModel.deleteMany({});
  await InsuranceBracketsModel.deleteMany({});
  await PayTypeModel.deleteMany({});
  await SigningBonusModel.deleteMany({});
  await TaxRulesModel.deleteMany({});
  await TerminationBenefitsModel.deleteMany({});

  console.log('Seeding Company Wide Settings...');
  await CompanyWideSettingsModel.create({
    payDate: new Date(),
    timeZone: 'Africa/Cairo',
    currency: 'EGP',
  });

  console.log('Seeding Pay Grades...');
  const ensurePayGrade = async (
    grade: string,
    payload: {
      baseSalary: number;
      grossSalary: number;
      status: ConfigStatus;
      createdBy?: mongoose.Types.ObjectId;
      approvedBy?: mongoose.Types.ObjectId;
      approvedAt?: Date;
    },
  ) => {
    const existing = await PayGradeModel.findOne({ grade });
    if (existing) return existing;
    return PayGradeModel.create({ grade, ...payload });
  };

  const juniorGrade = await ensurePayGrade('Junior', {
    baseSalary: 8000,
    grossSalary: 11000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  const seniorGrade = await ensurePayGrade('Senior', {
    baseSalary: 15000,
    grossSalary: 18000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  const midGrade = await ensurePayGrade('Mid Draft', {
    baseSalary: 10000,
    grossSalary: 13000,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
  });

  const internGrade = await ensurePayGrade('Intern Rejected', {
    baseSalary: 6000,
    grossSalary: 9000,
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Pay Grades seeded.');

  console.log('Seeding Allowances...');
  const housingAllowance = await AllowanceModel.create({
    name: 'Housing approved Allowance',
    amount: 2000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  const transportAllowance = await AllowanceModel.create({
    name: 'Transport Approved Allowance',
    amount: 1000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  const mealAllowance = await AllowanceModel.create({
    name: 'Meal Draft Allowance',
    amount: 1000,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });

  const telephoneAllowance = await AllowanceModel.create({
    name: 'Telephone Rejected Allowance',
    amount: 1000,
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Allowances seeded.');

  console.log('Seeding Insurance Brackets...');
  const socialInsurance = await InsuranceBracketsModel.create({
    name: 'Social Insurance',
    status: ConfigStatus.APPROVED,
    minSalary: 0,
    maxSalary: 3000,
    employeeRate: 8,
    employerRate: 14,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const socialInsurance2 = await InsuranceBracketsModel.create({
    name: 'Social Insurance',
    status: ConfigStatus.APPROVED,
    minSalary: 3001,
    maxSalary: 9000,
    employeeRate: 10,
    employerRate: 16,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const socialInsurance3 = await InsuranceBracketsModel.create({
    name: 'Social Insurance',
    status: ConfigStatus.APPROVED,
    minSalary: 9001,
    maxSalary: 100000,
    employeeRate: 12,
    employerRate: 18,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const medicalInsurance = await InsuranceBracketsModel.create({
    name: 'Medical Insurance Draft',
    amount: 500,
    status: ConfigStatus.DRAFT,
    minSalary: 2000,
    maxSalary: 10000,
    employeeRate: 11,
    employerRate: 18.75,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const carInsurance = await InsuranceBracketsModel.create({
    name: 'Car Insurance Rejected',
    amount: 500,
    status: ConfigStatus.REJECTED,
    minSalary: 2000,
    maxSalary: 10000,
    employeeRate: 11,
    employerRate: 18.75,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  console.log('Insurance Brackets seeded.');

  console.log('Seeding Pay Types...');
  const monthlyPayType = await PayTypeModel.create({
    type: 'Monthly Approved Salary',
    amount: 6000, // Minimum allowed value
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const hourlyPayType = await PayTypeModel.create({
    type: 'Hourly Draft Salary',
    amount: 6000, // Minimum allowed value
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const contactPayType = await PayTypeModel.create({
    type: 'Contact Rejected Salary',
    amount: 6000, // Minimum allowed value
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Pay Types seeded.');

  console.log('Seeding Signing Bonuses...');
  const seniorSigningBonus = await SigningBonusModel.create({
    positionName: 'Senior Developer',
    amount: 5000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const juniorSigningBonus = await SigningBonusModel.create({
    positionName: 'Junior Developer',
    amount: 1000,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const midSigningBonus = await SigningBonusModel.create({
    positionName: 'Mid Developer',
    amount: 3000,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const internSigningBonus = await SigningBonusModel.create({
    positionName: 'Intern Developer',
    amount: 500,
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Signing Bonuses seeded.');

  console.log('Seeding Tax Rules...');
  const standardTax = await TaxRulesModel.create({
    name: 'Standard Income Tax',
    description: 'Standard income tax deduction',
    rate: 10,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const salesTax = await TaxRulesModel.create({
    name: 'Sales Tax Draft',
    description: 'Sales tax deduction',
    rate: 20,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const VATTax = await TaxRulesModel.create({
    name: 'VAT Tax Rejected',
    description: 'VAT tax deduction',
    rate: 14,
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Tax Rules seeded.');

  console.log('Seeding Termination Benefits...');
  const endOfService = await TerminationBenefitsModel.create({
    name: 'End of Service Gratuity',
    amount: 10000,
    terms: 'After 1 year of service',
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const compensation = await TerminationBenefitsModel.create({
    name: 'Compensation Benefit Draft',
    amount: 10000,
    terms: 'After 1 year of service',
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const notice = await TerminationBenefitsModel.create({
    name: 'Notice Period Benefit Rejected',
    amount: 10000,
    terms: 'After 1 year of service',
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  console.log('Termination Benefits seeded.');

  console.log('Seeding Payroll Policies...');
  const taxPolicy = await PayrollPoliciesModel.create({
    policyName: 'Standard Approved Tax Policy',
    policyType: PolicyType.DEDUCTION,
    description: 'Applies standard tax rules',
    effectiveDate: new Date('2025-01-01'),
    ruleDefinition: {
      percentage: 10,
      fixedAmount: 0,
      thresholdAmount: 5000,
    },
    applicability: Applicability.AllEmployees,
    status: ConfigStatus.APPROVED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });
  const allowancePolicy = await PayrollPoliciesModel.create({
    policyName: 'Standard Draft Allowance Policy',
    policyType: PolicyType.ALLOWANCE,
    description: 'Applies standard allowance rules',
    effectiveDate: new Date('2025-01-01'),
    ruleDefinition: {
      percentage: 20,
      fixedAmount: 0,
      thresholdAmount: 4000,
    },
    applicability: Applicability.AllEmployees,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice._id,
    // approvedBy: employees.alice._id,
    // approvedAt: new Date(),
  });
  const benfitPolicy = await PayrollPoliciesModel.create({
    policyName: 'Standard Rejected Benfit Policy',
    policyType: PolicyType.BENEFIT,
    description: 'Applies standard  Benfit rules',
    effectiveDate: new Date('2025-01-01'),
    ruleDefinition: {
      percentage: 20,
      fixedAmount: 0,
      thresholdAmount: 4000,
    },
    applicability: Applicability.AllEmployees,
    status: ConfigStatus.REJECTED,
    createdBy: employees.alice._id,
    approvedBy: employees.alice._id,
    approvedAt: new Date(),
  });

  console.log('Payroll Policies seeded.');

  console.log('Aligning Pay Grades with Positions...');
  const positions = await PositionModel.find({}).lean();
  const payGradesBefore = await PayGradeModel.countDocuments();
  const existingPayGrades = await PayGradeModel.find({}).lean();

  const template = existingPayGrades[0] || {
    baseSalary: 8000,
    grossSalary: 11000,
    status: ConfigStatus.DRAFT,
    createdBy: employees.alice?._id,
  };

  const createdPayGrades: string[] = [];
  const renamedPayGrades: string[] = [];

  for (const position of positions) {
    const targetName = position.title;
    const existing = existingPayGrades.find((pg) => pg.grade === targetName);
    if (existing) {
      continue;
    }

    const created = await PayGradeModel.findOneAndUpdate(
      { grade: targetName },
      {
        $setOnInsert: {
          baseSalary: template.baseSalary,
          grossSalary: template.grossSalary,
          status: template.status,
          createdBy: template.createdBy || employees.alice?._id,
          approvedBy: template.status === ConfigStatus.APPROVED ? template.approvedBy : undefined,
          approvedAt: template.status === ConfigStatus.APPROVED ? template.approvedAt || new Date() : undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    createdPayGrades.push(`${created.grade} -> ${position.title}`);
  }

  const payGradesAfter = await PayGradeModel.countDocuments();

  const reportLines = [
    '# PayGrade Position Sync Report',
    `- Positions count: ${positions.length}`,
    `- PayGrades count before: ${payGradesBefore}`,
    `- PayGrades count after: ${payGradesAfter}`,
    `- PayGrades renamed: ${renamedPayGrades.length ? renamedPayGrades.join(', ') : 'none'}`,
    `- PayGrades created: ${createdPayGrades.length ? createdPayGrades.join(', ') : 'none'}`,
  ];

  writeFileSync(
    join(process.cwd(), 'PAYGRADE_POSITION_SYNC_REPORT.md'),
    `${reportLines.join('\n')}\n`,
  );
  console.log('Pay Grades aligned with Positions.');

  return {
    payGrades: { juniorGrade, seniorGrade, midGrade, internGrade },
    allowances: {
      housingAllowance,
      transportAllowance,
      mealAllowance,
      telephoneAllowance,
    },
    policies: { taxPolicy, allowancePolicy, benfitPolicy },
    insurance: {
      socialInsurance,
      socialInsurance2,
      socialInsurance3,
      medicalInsurance,
      carInsurance,
    },
    payTypes: { monthlyPayType, hourlyPayType, contactPayType },
    bonuses: {
      seniorSigningBonus,
      juniorSigningBonus,
      midSigningBonus,
      internSigningBonus,
    },
    taxes: { standardTax, salesTax, VATTax },
    benefits: { endOfService, compensation, notice },
  };
}
