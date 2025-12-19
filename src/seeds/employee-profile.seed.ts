import mongoose from 'mongoose';
import { EmployeeProfileSchema } from '../employee-profile/models/employee-profile.schema';
import { EmployeeSystemRoleSchema } from '../employee-profile/models/employee-system-role.schema';
import { EmployeeProfileChangeRequestSchema } from '../employee-profile/models/ep-change-request.schema';
import { EmployeeQualificationSchema } from '../employee-profile/models/qualification.schema';
import {
  EmployeeStatus,
  ContractType,
  WorkType,
  Gender,
  MaritalStatus,
  SystemRole,
  GraduationType,
  ProfileChangeStatus,
} from '../employee-profile/enums/employee-profile.enums';

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedDepartments = {
  hrDept: SeedRef;
  engDept: SeedRef;
  salesDept: SeedRef;
};
type SeedPositions = {
  hrManagerPos: SeedRef;
  softwareEngPos: SeedRef;
  hrGeneralistPos: SeedRef;
  qaEngineerPos: SeedRef;
  salesRepPos: SeedRef;
  seniorSoftwareEngPos: SeedRef;
  salesLeadPos: SeedRef;
};

export async function seedEmployeeProfile(
  connection: mongoose.Connection,
  departments: SeedDepartments,
  positions: SeedPositions,
) {
  const EmployeeProfileModel = connection.model(
    'EmployeeProfile',
    EmployeeProfileSchema,
  );
  const EmployeeSystemRoleModel = connection.model(
    'EmployeeSystemRole',
    EmployeeSystemRoleSchema,
  );
  const EmployeeProfileChangeRequestModel = connection.model(
    'EmployeeProfileChangeRequest',
    EmployeeProfileChangeRequestSchema,
  );
  const EmployeeQualificationModel = connection.model(
    'EmployeeQualification',
    EmployeeQualificationSchema,
  );

  console.log('Clearing Employee Profiles...');
  await EmployeeProfileModel.deleteMany({});
  await EmployeeSystemRoleModel.deleteMany({});
  await EmployeeProfileChangeRequestModel.deleteMany({});
  await EmployeeQualificationModel.deleteMany({});

  console.log('Seeding Employees...');
  const alice = await EmployeeProfileModel.create({
    firstName: 'Alice',
    lastName: 'Smith',
    fullName: 'Alice Smith',
    nationalId: 'NAT-ALICE-001',
    password: 'password123',
    employeeNumber: 'EMP-001',
    dateOfHire: new Date('2020-01-01'),
    workEmail: 'alice@company.com',
    bankName: 'First National Bank',
    bankAccountNumber: 'FNB-001-2020',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const bob = await EmployeeProfileModel.create({
    firstName: 'Bob',
    lastName: 'Jones',
    fullName: 'Bob Jones',
    nationalId: 'NAT-BOB-002',
    password: 'password123',
    employeeNumber: 'EMP-002',
    dateOfHire: new Date('2021-05-15'),
    workEmail: 'bob@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-002-2021',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.softwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const charlie = await EmployeeProfileModel.create({
    firstName: 'Charlie',
    lastName: 'Brown',
    fullName: 'Charlie Brown',
    nationalId: 'NAT-CHARLIE-003',
    password: 'password123',
    employeeNumber: 'EMP-003',
    dateOfHire: new Date('2022-03-10'),
    workEmail: 'charlie@company.com',
    bankName: 'Global Savings',
    bankAccountNumber: 'GS-003-2022',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.salesRepPos._id,
    primaryDepartmentId: departments.salesDept._id,
  });

  const diana = await EmployeeProfileModel.create({
    firstName: 'Diana',
    lastName: 'Prince',
    fullName: 'Diana Prince',
    nationalId: 'NAT-DIANA-004',
    password: 'password123',
    employeeNumber: 'EMP-004',
    dateOfHire: new Date('2019-07-01'),
    workEmail: 'diana@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-004-2019',
    status: EmployeeStatus.INACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.DIVORCED,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const eric = await EmployeeProfileModel.create({
    firstName: 'Eric',
    lastName: 'Stone',
    fullName: 'Eric Stone',
    nationalId: 'NAT-ERIC-005',
    password: 'password123',
    employeeNumber: 'EMP-005',
    dateOfHire: new Date('2023-04-12'),
    workEmail: 'eric@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-005-2023',
    status: EmployeeStatus.ON_LEAVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.WIDOWED,
    primaryPositionId: positions.softwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const fatima = await EmployeeProfileModel.create({
    firstName: 'Fatima',
    lastName: 'Hassan',
    fullName: 'Fatima Hassan',
    nationalId: 'NAT-FATIMA-006',
    password: 'password123',
    employeeNumber: 'EMP-006',
    dateOfHire: new Date('2018-11-20'),
    workEmail: 'fatima@company.com',
    bankName: 'First National Bank',
    bankAccountNumber: 'FNB-006-2018',
    status: EmployeeStatus.SUSPENDED,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const george = await EmployeeProfileModel.create({
    firstName: 'George',
    lastName: 'Ibrahim',
    fullName: 'George Ibrahim',
    nationalId: 'NAT-GEORGE-007',
    password: 'password123',
    employeeNumber: 'EMP-007',
    dateOfHire: new Date('2010-02-15'),
    workEmail: 'george@company.com',
    bankName: 'Global Savings',
    bankAccountNumber: 'GS-007-2010',
    status: EmployeeStatus.RETIRED,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.salesRepPos._id,
    primaryDepartmentId: departments.salesDept._id,
  });

  const hannah = await EmployeeProfileModel.create({
    firstName: 'Hannah',
    lastName: 'Lee',
    fullName: 'Hannah Lee',
    nationalId: 'NAT-HANNAH-008',
    password: 'password123',
    employeeNumber: 'EMP-008',
    dateOfHire: new Date('2025-01-05'),
    workEmail: 'hannah@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-008-2025',
    status: EmployeeStatus.PROBATION,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.salesRepPos._id,
    primaryDepartmentId: departments.salesDept._id,
  });

  const ian = await EmployeeProfileModel.create({
    firstName: 'Ian',
    lastName: 'Clark',
    fullName: 'Ian Clark',
    nationalId: 'NAT-IAN-009',
    password: 'password123',
    employeeNumber: 'EMP-009',
    dateOfHire: new Date('2017-06-18'),
    workEmail: 'ian@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-009-2017',
    status: EmployeeStatus.TERMINATED,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.DIVORCED,
    primaryPositionId: positions.softwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const kevin = await EmployeeProfileModel.create({
    firstName: 'Kevin',
    lastName: 'Adams',
    fullName: 'Kevin Adams',
    nationalId: 'NAT-KEVIN-010',
    password: 'password123',
    employeeNumber: 'EMP-010',
    dateOfHire: new Date('2024-08-01'),
    workEmail: 'kevin@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-010-2024',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.hrGeneralistPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const lina = await EmployeeProfileModel.create({
    firstName: 'Lina',
    lastName: 'Park',
    fullName: 'Lina Park',
    nationalId: 'NAT-LINA-011',
    password: 'password123',
    employeeNumber: 'EMP-011',
    dateOfHire: new Date('2024-09-10'),
    workEmail: 'lina@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-011-2024',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.qaEngineerPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const paula = await EmployeeProfileModel.create({
    firstName: 'Paula',
    lastName: 'Payne',
    fullName: 'Paula Payne',
    nationalId: 'NAT-PAULA-012',
    password: 'password123',
    employeeNumber: 'EMP-012',
    dateOfHire: new Date('2024-12-01'),
    workEmail: 'paula@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-012-2024',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const rami = await EmployeeProfileModel.create({
    firstName: 'Rami',
    lastName: 'Reed',
    fullName: 'Rami Reed',
    nationalId: 'NAT-RAMI-013',
    password: 'password123',
    employeeNumber: 'EMP-013',
    dateOfHire: new Date('2025-01-20'),
    workEmail: 'rami@company.com',
    bankName: 'First National Bank',
    bankAccountNumber: 'FNB-013-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrGeneralistPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const sarah = await EmployeeProfileModel.create({
    firstName: 'Sarah',
    lastName: 'Nguyen',
    fullName: 'Sarah Nguyen',
    nationalId: 'NAT-SARAH-014',
    password: 'password123',
    employeeNumber: 'EMP-014',
    dateOfHire: new Date('2025-02-15'),
    workEmail: 'sarah.senior.swe@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-014-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.seniorSoftwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const samir = await EmployeeProfileModel.create({
    firstName: 'Samir',
    lastName: 'Saleh',
    fullName: 'Samir Saleh',
    nationalId: 'NAT-SAMIR-015',
    password: 'password123',
    employeeNumber: 'EMP-015',
    dateOfHire: new Date('2025-03-01'),
    workEmail: 'samir.sales.lead@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-015-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.salesLeadPos._id,
    primaryDepartmentId: departments.salesDept._id,
  });
  console.log('Employees seeded.');

  console.log('Assigning employee system roles...');
  await EmployeeSystemRoleModel.create([
    {
      employeeProfileId: alice._id,
      roles: [SystemRole.HR_MANAGER],
      permissions: ['org.manage', 'hr.manage'],
    },
    {
      employeeProfileId: bob._id,
      roles: [SystemRole.PAYROLL_SPECIALIST],
      permissions: ['payroll.process'],
    },
    {
      employeeProfileId: charlie._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: [],
    },
    {
      employeeProfileId: diana._id,
      roles: [SystemRole.DEPARTMENT_HEAD],
      permissions: ['org.manage.department'],
    },
    {
      employeeProfileId: eric._id,
      roles: [SystemRole.HR_EMPLOYEE],
      permissions: ['hr.view'],
    },
    {
      employeeProfileId: fatima._id,
      roles: [SystemRole.SYSTEM_ADMIN],
      permissions: ['system.admin'],
    },
    {
      employeeProfileId: george._id,
      roles: [SystemRole.LEGAL_POLICY_ADMIN],
      permissions: ['policy.manage'],
    },
    {
      employeeProfileId: hannah._id,
      roles: [SystemRole.FINANCE_STAFF],
      permissions: ['finance.view'],
    },
    {
      employeeProfileId: ian._id,
      roles: [SystemRole.HR_ADMIN],
      permissions: ['hr.manage'],
    },
    {
      employeeProfileId: kevin._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: [],
    },
    {
      employeeProfileId: lina._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: [],
    },
    {
      employeeProfileId: paula._id,
      roles: [SystemRole.PAYROLL_MANAGER],
      permissions: ['payroll.manage', 'payroll.approve'],
    },
    {
      employeeProfileId: rami._id,
      roles: [SystemRole.RECRUITER],
      permissions: ['recruitment.manage'],
    },
    {
      employeeProfileId: sarah._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
    {
      employeeProfileId: samir._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
  ]);

  console.log('Seeding employee qualifications...');
  await EmployeeQualificationModel.create([
    {
      employeeProfileId: alice._id,
      establishmentName: 'Cairo University',
      graduationType: GraduationType.MASTER,
    },
    {
      employeeProfileId: bob._id,
      establishmentName: 'AUC',
      graduationType: GraduationType.BACHELOR,
    },
  ]);

  console.log('Seeding employee profile change requests...');
  await EmployeeProfileChangeRequestModel.create({
    requestId: 'REQ-EP-001',
    employeeProfileId: charlie._id,
    requestDescription: 'Update work email to charlie.sales@company.com',
    reason: 'Team branding alignment',
    status: ProfileChangeStatus.PENDING,
  });

  return { alice, bob, charlie };
}
