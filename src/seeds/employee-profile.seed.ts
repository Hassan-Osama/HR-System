import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { DepartmentSchema } from '../organization-structure/models/department.schema';
import { PositionSchema } from '../organization-structure/models/position.schema';
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
  learningDept: SeedRef;
  financeDept: SeedRef;
  libraryDept: SeedRef;
  opsInactiveDept: SeedRef;
  testDept: SeedRef;
};
type SeedPositions = {
  hrManagerPos: SeedRef;
  softwareEngPos: SeedRef;
  hrGeneralistPos: SeedRef;
  qaEngineerPos: SeedRef;
  salesRepPos: SeedRef;
  seniorSoftwareEngPos: SeedRef;
  salesLeadPos: SeedRef;
  taPos: SeedRef;
  laPos: SeedRef;
  accountantPos: SeedRef;
  librarianPos: SeedRef;
  opsAnalystInactivePos: SeedRef;
  testDeptHeadPos: SeedRef;
  testDeptEmployeePos: SeedRef;
};

const SEED_PASSWORD = 'ChangeMe123';

export async function seedEmployeeProfile(
  connection: mongoose.Connection,
  departments: SeedDepartments,
  positions: SeedPositions,
) {
  const EmployeeProfileModel = connection.model(
    'EmployeeProfile',
    EmployeeProfileSchema,
  );
  const DepartmentModel = connection.model('Department', DepartmentSchema);
  const PositionModel = connection.model('Position', PositionSchema);
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

  console.log(
    'Clearing Employee supporting collections (roles/requests/quals)...',
  );
  await EmployeeSystemRoleModel.deleteMany({});
  await EmployeeProfileChangeRequestModel.deleteMany({});
  await EmployeeQualificationModel.deleteMany({});

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  const headDepartments = await DepartmentModel.find({
    headPositionId: { $exists: true },
  }).lean();

  const positionCountBefore = await PositionModel.countDocuments();
  const employeeCountBefore = await EmployeeProfileModel.countDocuments();

  const createEmployee = async <T extends Record<string, unknown>>(
    payload: T,
  ) => {
    const workEmail = payload.workEmail as string | undefined;
    const employeeNumber = payload.employeeNumber as string | undefined;
    const nationalId = payload.nationalId as string | undefined;

    const orFilters = [
      workEmail ? { workEmail } : undefined,
      employeeNumber ? { employeeNumber } : undefined,
      nationalId ? { nationalId } : undefined,
    ].filter(Boolean) as mongoose.FilterQuery<unknown>[];

    const filter: mongoose.FilterQuery<unknown> = orFilters.length
      ? { $or: orFilters }
      : {};

    const existing = await EmployeeProfileModel.findOne(filter);
    if (existing) {
      return existing;
    }
    try {
      return await EmployeeProfileModel.create({
        ...payload,
        password: hashedPassword,
      });
    } catch (err: unknown) {
      const dup = (err as { code?: number }).code === 11000;
      if (dup) {
        const fallback = await EmployeeProfileModel.findOne(filter);
        if (fallback) {
          return fallback;
        }
      }
      throw err;
    }
  };

  console.log('Seeding Employees...');
  const alice = await createEmployee({
    firstName: 'Alice',
    lastName: 'Smith',
    fullName: 'Alice Smith',
    nationalId: 'NAT-ALICE-001',
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

  const bob = await createEmployee({
    firstName: 'Bob',
    lastName: 'Jones',
    fullName: 'Bob Jones',
    nationalId: 'NAT-BOB-002',
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
    primaryPositionId: positions.accountantPos._id,
    primaryDepartmentId: departments.financeDept._id,
  });

  const charlie = await createEmployee({
    firstName: 'Charlie',
    lastName: 'Brown',
    fullName: 'Charlie Brown',
    nationalId: 'NAT-CHARLIE-003',
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

  const diana = await createEmployee({
    firstName: 'Diana',
    lastName: 'Prince',
    fullName: 'Diana Prince',
    nationalId: 'NAT-DIANA-004',
    employeeNumber: 'EMP-004',
    dateOfHire: new Date('2019-07-01'),
    workEmail: 'diana@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-004-2019',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.DIVORCED,
    primaryPositionId: positions.seniorSoftwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const eric = await createEmployee({
    firstName: 'Eric',
    lastName: 'Stone',
    fullName: 'Eric Stone',
    nationalId: 'NAT-ERIC-005',
    employeeNumber: 'EMP-005',
    dateOfHire: new Date('2023-04-12'),
    workEmail: 'eric@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-005-2023',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.WIDOWED,
    primaryPositionId: positions.softwareEngPos._id,
    primaryDepartmentId: departments.engDept._id,
  });

  const fatima = await createEmployee({
    firstName: 'Fatima',
    lastName: 'Hassan',
    fullName: 'Fatima Hassan',
    nationalId: 'NAT-FATIMA-006',
    employeeNumber: 'EMP-006',
    dateOfHire: new Date('2018-11-20'),
    workEmail: 'fatima@company.com',
    bankName: 'First National Bank',
    bankAccountNumber: 'FNB-006-2018',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.hrManagerPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const george = await createEmployee({
    firstName: 'George',
    lastName: 'Ibrahim',
    fullName: 'George Ibrahim',
    nationalId: 'NAT-GEORGE-007',
    employeeNumber: 'EMP-007',
    dateOfHire: new Date('2010-02-15'),
    workEmail: 'george@company.com',
    bankName: 'Global Savings',
    bankAccountNumber: 'GS-007-2010',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.hrGeneralistPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const hannah = await createEmployee({
    firstName: 'Hannah',
    lastName: 'Lee',
    fullName: 'Hannah Lee',
    nationalId: 'NAT-HANNAH-008',
    employeeNumber: 'EMP-008',
    dateOfHire: new Date('2025-01-05'),
    workEmail: 'hannah@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-008-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.PART_TIME_CONTRACT,
    workType: WorkType.PART_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.accountantPos._id,
    primaryDepartmentId: departments.financeDept._id,
  });

  const ian = await createEmployee({
    firstName: 'Ian',
    lastName: 'Clark',
    fullName: 'Ian Clark',
    nationalId: 'NAT-IAN-009',
    employeeNumber: 'EMP-009',
    dateOfHire: new Date('2017-06-18'),
    workEmail: 'ian@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-009-2017',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.DIVORCED,
    primaryPositionId: positions.hrGeneralistPos._id,
    primaryDepartmentId: departments.hrDept._id,
  });

  const kevin = await createEmployee({
    firstName: 'Kevin',
    lastName: 'Adams',
    fullName: 'Kevin Adams',
    nationalId: 'NAT-KEVIN-010',
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

  const lina = await createEmployee({
    firstName: 'Lina',
    lastName: 'Park',
    fullName: 'Lina Park',
    nationalId: 'NAT-LINA-011',
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

  const paula = await createEmployee({
    firstName: 'Paula',
    lastName: 'Payne',
    fullName: 'Paula Payne',
    nationalId: 'NAT-PAULA-012',
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
    primaryPositionId: positions.accountantPos._id,
    primaryDepartmentId: departments.financeDept._id,
  });

  const rami = await createEmployee({
    firstName: 'Rami',
    lastName: 'Reed',
    fullName: 'Rami Reed',
    nationalId: 'NAT-RAMI-013',
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

  const sarah = await createEmployee({
    firstName: 'Sarah',
    lastName: 'Nguyen',
    fullName: 'Sarah Nguyen',
    nationalId: 'NAT-SARAH-014',
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

  const samir = await createEmployee({
    firstName: 'Samir',
    lastName: 'Saleh',
    fullName: 'Samir Saleh',
    nationalId: 'NAT-SAMIR-015',
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

  const tariq = await createEmployee({
    firstName: 'Tariq',
    lastName: 'Adel',
    fullName: 'Tariq Adel',
    nationalId: 'NAT-TARIQ-016',
    employeeNumber: 'EMP-016',
    dateOfHire: new Date('2025-04-05'),
    workEmail: 'tariq.ta@company.com',
    bankName: 'First National Bank',
    bankAccountNumber: 'FNB-016-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.taPos._id,
    primaryDepartmentId: departments.learningDept._id,
  });

  const laila = await createEmployee({
    firstName: 'Laila',
    lastName: 'Abbas',
    fullName: 'Laila Abbas',
    nationalId: 'NAT-LAILA-017',
    employeeNumber: 'EMP-017',
    dateOfHire: new Date('2025-04-10'),
    workEmail: 'laila.la@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-017-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.laPos._id,
    primaryDepartmentId: departments.learningDept._id,
  });

  const amir = await createEmployee({
    firstName: 'Amir',
    lastName: 'Nabil',
    fullName: 'Amir Nabil',
    nationalId: 'NAT-AMIR-018',
    employeeNumber: 'EMP-018',
    dateOfHire: new Date('2025-04-15'),
    workEmail: 'amir.accountant@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-018-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.MARRIED,
    primaryPositionId: positions.accountantPos._id,
    primaryDepartmentId: departments.financeDept._id,
  });

  const salma = await createEmployee({
    firstName: 'Salma',
    lastName: 'Khaled',
    fullName: 'Salma Khaled',
    nationalId: 'NAT-SALMA-019',
    employeeNumber: 'EMP-019',
    dateOfHire: new Date('2025-04-20'),
    workEmail: 'salma.librarian@company.com',
    bankName: 'Global Savings',
    bankAccountNumber: 'GS-019-2025',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.librarianPos._id,
    primaryDepartmentId: departments.libraryDept._id,
  });

  const testHead = await createEmployee({
    firstName: 'Tess',
    lastName: 'Headley',
    fullName: 'Tess Headley',
    nationalId: 'NAT-TEST-HEAD-020',
    employeeNumber: 'EMP-TEST-020',
    dateOfHire: new Date('2025-05-01'),
    workEmail: 'tess.headley@company.com',
    bankName: 'Capital Bank',
    bankAccountNumber: 'CB-TEST-020',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.FEMALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.testDeptHeadPos._id,
    primaryDepartmentId: departments.testDept._id,
  });

  const testEmployee = await createEmployee({
    firstName: 'Evan',
    lastName: 'Tester',
    fullName: 'Evan Tester',
    nationalId: 'NAT-TEST-EMP-021',
    employeeNumber: 'EMP-TEST-021',
    dateOfHire: new Date('2025-05-02'),
    workEmail: 'evan.tester@company.com',
    bankName: 'Metro Credit Union',
    bankAccountNumber: 'MCU-TEST-021',
    status: EmployeeStatus.ACTIVE,
    contractType: ContractType.FULL_TIME_CONTRACT,
    workType: WorkType.FULL_TIME,
    gender: Gender.MALE,
    maritalStatus: MaritalStatus.SINGLE,
    primaryPositionId: positions.testDeptEmployeePos._id,
    primaryDepartmentId: departments.testDept._id,
  });
  console.log('Employees seeded.');

  const headRoleAssignments: Array<{
    employeeProfileId: mongoose.Types.ObjectId;
    roles: SystemRole[];
    permissions: string[];
    report: string;
  }> = [];

  for (const dept of headDepartments) {
    if (!dept.headPositionId) {
      continue;
    }

    const headPosId = dept.headPositionId as mongoose.Types.ObjectId;

    let headEmployee = await EmployeeProfileModel.findOne({
      primaryPositionId: headPosId,
    });

    if (!headEmployee) {
      const emailHandle = (dept.code || dept.name)
        .toLowerCase()
        .replace(/\s+/g, '-');
      headEmployee = await createEmployee({
        firstName: 'Head',
        lastName: dept.name,
        fullName: `Head ${dept.name}`,
        nationalId: `NAT-HEAD-${dept.code || dept.name}`,
        employeeNumber: `EMP-HEAD-${dept.code || dept.name}`,
        dateOfHire: new Date('2025-06-15'),
        workEmail: `head.${emailHandle}@company.com`,
        bankName: 'Head Bank',
        bankAccountNumber: `HEAD-${dept.code || dept.name}`,
        status: EmployeeStatus.ACTIVE,
        contractType: ContractType.FULL_TIME_CONTRACT,
        workType: WorkType.FULL_TIME,
        gender: Gender.MALE,
        maritalStatus: MaritalStatus.SINGLE,
        primaryPositionId: headPosId,
        primaryDepartmentId: dept._id,
      });
    }

    headRoleAssignments.push({
      employeeProfileId: headEmployee._id,
      roles: [SystemRole.DEPARTMENT_HEAD],
      permissions: ['org.manage.department'],
      report: `${dept.name}: ${headEmployee.workEmail} -> DEPARTMENT_HEAD`,
    });
  }

  console.log('Covering inactive departments with positions and employees...');
  const inactiveDepartments = await DepartmentModel.find({
    isActive: false,
  }).lean();

  const coverageRoleAssignments: Array<{
    employeeProfileId: mongoose.Types.ObjectId;
    roles: SystemRole[];
    permissions: string[];
  }> = [];

  const coverageReportLines: string[] = [];

  for (const dept of inactiveDepartments) {
    const positionTitle = `Inactive - ${dept.name} Position`;
    const positionCode = `POS-${dept.code}-INACTIVE-COVERAGE`;

    const coveragePosition = await PositionModel.findOneAndUpdate(
      { title: positionTitle, departmentId: dept._id },
      {
        $setOnInsert: {
          code: positionCode,
          description: `Coverage position for inactive department ${dept.name}`,
          isActive: false,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const emailHandle = dept.code.toLowerCase().replace(/\s+/g, '-');
    const coverageEmployee = await createEmployee({
      firstName: 'Inactive',
      lastName: dept.name.replace(/\s+/g, ''),
      fullName: `Inactive ${dept.name}`,
      nationalId: `NAT-INACTIVE-${dept.code}`,
      employeeNumber: `EMP-INACTIVE-${dept.code}`,
      dateOfHire: new Date('2025-06-01'),
      workEmail: `inactive.${emailHandle}@company.com`,
      bankName: 'Coverage Bank',
      bankAccountNumber: `COV-${dept.code}`,
      status: EmployeeStatus.ACTIVE,
      contractType: ContractType.FULL_TIME_CONTRACT,
      workType: WorkType.FULL_TIME,
      gender: Gender.MALE,
      maritalStatus: MaritalStatus.SINGLE,
      primaryPositionId: coveragePosition._id,
      primaryDepartmentId: dept._id,
    });

    coverageRoleAssignments.push({
      employeeProfileId: coverageEmployee._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    });

    coverageReportLines.push(
      `- ${dept.name}: position ${coveragePosition.code} -> employee ${coverageEmployee.workEmail}`,
    );
  }

  console.log('Assigning employee system roles...');
  const headIds = new Set(
    headRoleAssignments.map((h) => `${h.employeeProfileId}`),
  );

  const baseRoleAssignments = [
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
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
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
      roles: [SystemRole.HR_EMPLOYEE],
      permissions: ['hr.view'],
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
      roles: [SystemRole.FINANCE_STAFF],
      permissions: ['finance.view'],
    },
    {
      employeeProfileId: rami._id,
      roles: [SystemRole.HR_ADMIN],
      permissions: ['hr.manage'],
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
    {
      employeeProfileId: tariq._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
    {
      employeeProfileId: laila._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
    {
      employeeProfileId: amir._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['finance.view'],
    },
    {
      employeeProfileId: salma._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
    {
      employeeProfileId: testEmployee._id,
      roles: [SystemRole.DEPARTMENT_EMPLOYEE],
      permissions: ['org.read'],
    },
    ...coverageRoleAssignments,
  ].filter((assignment) => !headIds.has(`${assignment.employeeProfileId}`));

  await EmployeeSystemRoleModel.create([
    ...baseRoleAssignments,
    ...headRoleAssignments,
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

  const reportLines = [
    '# Test Department Seed Report',
    '- Department: TEST-001',
    `- Department head: ${testHead.workEmail}`,
    `- Regular employee: ${testEmployee.workEmail}`,
    '- Roles assigned:',
    `  - ${testHead.workEmail}: ${SystemRole.DEPARTMENT_HEAD}`,
    `  - ${testEmployee.workEmail}: ${SystemRole.DEPARTMENT_EMPLOYEE}`,
  ];

  writeFileSync(
    join(process.cwd(), 'TEST_DEPARTMENT_SEED_REPORT.md'),
    `${reportLines.join('\n')}\n`,
  );

  const departmentHeadScenarioReport = [
    '# Department Head Scenario Report',
    '- Department: TEST-001 (Test Department)',
    `- Head: ${testHead.workEmail} (role: ${SystemRole.DEPARTMENT_HEAD})`,
    '- Additional employees:',
    `  - ${testEmployee.workEmail} (role: ${SystemRole.DEPARTMENT_EMPLOYEE})`,
    '- Total employees in department: 2',
  ];

  writeFileSync(
    join(process.cwd(), 'DEPARTMENT_HEAD_SCENARIO_REPORT.md'),
    `${departmentHeadScenarioReport.join('\n')}\n`,
  );

  const positionCountAfter = await PositionModel.countDocuments();
  const employeeCountAfter = await EmployeeProfileModel.countDocuments();

  const inactiveCoverageReport = [
    '# Inactive Department Coverage Report',
    `- Inactive departments found: ${inactiveDepartments.length}`,
    `- Positions before: ${positionCountBefore}`,
    `- Positions after: ${positionCountAfter}`,
    `- Employees before: ${employeeCountBefore}`,
    `- Employees after: ${employeeCountAfter}`,
    '- Details:',
    ...(coverageReportLines.length ? coverageReportLines : ['- None created']),
  ];

  writeFileSync(
    join(process.cwd(), 'INACTIVE_DEPARTMENT_COVERAGE_REPORT.md'),
    `${inactiveCoverageReport.join('\n')}\n`,
  );

  const headRolesReport = [
    '# Department Head Roles Audit Report',
    `- Total departments: ${headDepartments.length}`,
    `- Heads found: ${headRoleAssignments.length}`,
    `- Heads fixed: ${headRoleAssignments.length}`,
    `- Heads missing: 0`,
    '- Details:',
    ...(headRoleAssignments.length
      ? headRoleAssignments.map((h) => `- ${h.report}`)
      : ['- None']),
  ];

  writeFileSync(
    join(process.cwd(), 'DEPARTMENT_HEAD_ROLES_AUDIT_REPORT.md'),
    `${headRolesReport.join('\n')}\n`,
  );

  return {
    alice,
    bob,
    charlie,
    diana,
    eric,
    fatima,
    george,
    hannah,
    ian,
    kevin,
    lina,
    paula,
    rami,
    sarah,
    samir,
    tariq,
    laila,
    amir,
    salma,
    testHead,
    testEmployee,
  };
}
