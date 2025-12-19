import mongoose from 'mongoose';
import { DepartmentSchema } from '../organization-structure/models/department.schema';
import { PositionSchema } from '../organization-structure/models/position.schema';
import { PositionAssignmentSchema } from '../organization-structure/models/position-assignment.schema';
import { StructureChangeRequestSchema } from '../organization-structure/models/structure-change-request.schema';
import { StructureApprovalSchema } from '../organization-structure/models/structure-approval.schema';
import { StructureChangeLogSchema } from '../organization-structure/models/structure-change-log.schema';
import {
  StructureRequestType,
  StructureRequestStatus,
  ApprovalDecision,
  ChangeLogAction,
} from '../organization-structure/enums/organization-structure.enums';

export async function seedOrganizationStructure(connection: mongoose.Connection) {
  const DepartmentModel = connection.model('Department', DepartmentSchema);
  const PositionModel = connection.model('Position', PositionSchema);

  console.log('Clearing Organization Structure data...');
  await DepartmentModel.deleteMany({});
  await PositionModel.deleteMany({});
  
  // 1. Create Departments
  console.log('Seeding Departments...');
  const hrDept = await DepartmentModel.create({
    code: 'HR-001',
    name: 'Human Resources',
    description: 'Handles all HR related tasks',
    isActive: true,
  });

  const engDept = await DepartmentModel.create({
    code: 'ENG-001',
    name: 'Engineering',
    description: 'Software Development and Engineering',
    isActive: true,
  });

  const salesDept = await DepartmentModel.create({
    code: 'SALES-001',
    name: 'Sales',
    description: 'Sales and Marketing',
    isActive: true,
  });

  const learningDept = await DepartmentModel.create({
    code: 'LND-001',
    name: 'Learning and Development',
    description: 'Learning, training, and academic support',
    isActive: true,
  });

  const financeDept = await DepartmentModel.create({
    code: 'FIN-001',
    name: 'Finance',
    description: 'Finance and accounting operations',
    isActive: true,
  });

  const libraryDept = await DepartmentModel.create({
    code: 'LIB-001',
    name: 'Library Services',
    description: 'Knowledge center and library operations',
    isActive: true,
  });

  const opsInactiveDept = await DepartmentModel.create({
    code: 'OPS-001-INACTIVE',
    name: 'Operations (Inactive)',
    description: 'Inactive operations unit for coverage',
    isActive: false,
  });
  console.log('Departments seeded.');

  // 2. Create Positions
  console.log('Seeding Positions...');
  const hrManagerPos = await PositionModel.create({
    code: 'POS-HR-MGR',
    title: 'HR Manager',
    description: 'Manager of Human Resources',
    departmentId: hrDept._id,
    isActive: true,
  });

  const hrGeneralistPos = await PositionModel.create({
    code: 'POS-HR-GEN',
    title: 'HR Generalist',
    description: 'HR operations and employee relations',
    departmentId: hrDept._id,
    isActive: true,
  });

  const softwareEngPos = await PositionModel.create({
    code: 'POS-SWE',
    title: 'Software Engineer',
    description: 'Full Stack Developer',
    departmentId: engDept._id,
    isActive: true,
  });

  const seniorSoftwareEngPos = await PositionModel.create({
    code: 'POS-SENIOR-SWE',
    title: 'Senior Software Engineer',
    description: 'Leads software engineering initiatives',
    departmentId: engDept._id,
    isActive: true,
  });

  const qaEngineerPos = await PositionModel.create({
    code: 'POS-QA-ENG',
    title: 'QA Engineer',
    description: 'Quality assurance and testing',
    departmentId: engDept._id,
    isActive: true,
  });

  const salesRepPos = await PositionModel.create({
    code: 'POS-SALES-REP',
    title: 'Sales Representative',
    description: 'Sales Representative',
    departmentId: salesDept._id,
    isActive: true,
  });

  const salesLeadPos = await PositionModel.create({
    code: 'POS-SALES-LEAD',
    title: 'Sales Lead',
    description: 'Leads sales team for regional accounts',
    departmentId: salesDept._id,
    isActive: true,
  });

  const taPos = await PositionModel.create({
    code: 'POS-TA',
    title: 'TA',
    description: 'Teaching Assistant supporting learning programs',
    departmentId: learningDept._id,
    isActive: true,
  });

  const laPos = await PositionModel.create({
    code: 'POS-LA',
    title: 'LA',
    description: 'Learning Advisor guiding training plans',
    departmentId: learningDept._id,
    isActive: true,
  });

  const accountantPos = await PositionModel.create({
    code: 'POS-ACC',
    title: 'Accountant',
    description: 'Handles accounting operations and reporting',
    departmentId: financeDept._id,
    isActive: true,
  });

  const librarianPos = await PositionModel.create({
    code: 'POS-LIB',
    title: 'Librarian',
    description: 'Manages library resources and circulation',
    departmentId: libraryDept._id,
    isActive: true,
  });

  const opsAnalystInactivePos = await PositionModel.create({
    code: 'POS-OPS-INACTIVE',
    title: 'Operations Analyst (Inactive)',
    description: 'Inactive position for coverage',
    departmentId: opsInactiveDept._id,
    isActive: false,
  });
  console.log('Positions seeded.');

  return {
    departments: {
      hrDept,
      engDept,
      salesDept,
      learningDept,
      financeDept,
      libraryDept,
      opsInactiveDept,
    },
    positions: {
      hrManagerPos,
      hrGeneralistPos,
      softwareEngPos,
      qaEngineerPos,
      seniorSoftwareEngPos,
      salesRepPos,
      salesLeadPos,
      taPos,
      laPos,
      accountantPos,
      librarianPos,
      opsAnalystInactivePos,
    },
  };
}

export async function seedPositionAssignments(connection: mongoose.Connection, employees: any, positions: any, departments: any) {
  const PositionAssignmentModel = connection.model('PositionAssignment', PositionAssignmentSchema);
  const StructureChangeRequestModel = connection.model('StructureChangeRequest', StructureChangeRequestSchema);
  const StructureApprovalModel = connection.model('StructureApproval', StructureApprovalSchema);
  const StructureChangeLogModel = connection.model('StructureChangeLog', StructureChangeLogSchema);
  
  console.log('Clearing Position Assignments...');
  await PositionAssignmentModel.deleteMany({});
  await StructureChangeRequestModel.deleteMany({});
  await StructureApprovalModel.deleteMany({});
  await StructureChangeLogModel.deleteMany({});

  console.log('Seeding Position Assignments...');
  await PositionAssignmentModel.create({
    employeeProfileId: employees.alice._id,
    positionId: positions.hrManagerPos._id,
    departmentId: departments.hrDept._id,
    startDate: new Date('2020-01-01'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.bob._id,
    positionId: positions.softwareEngPos._id,
    departmentId: departments.engDept._id,
    startDate: new Date('2021-05-15'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.charlie._id,
    positionId: positions.salesRepPos._id,
    departmentId: departments.salesDept._id,
    startDate: new Date('2022-03-10'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.tariq._id,
    positionId: positions.taPos._id,
    departmentId: departments.learningDept._id,
    startDate: new Date('2025-04-05'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.laila._id,
    positionId: positions.laPos._id,
    departmentId: departments.learningDept._id,
    startDate: new Date('2025-04-10'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.amir._id,
    positionId: positions.accountantPos._id,
    departmentId: departments.financeDept._id,
    startDate: new Date('2025-04-15'),
  });

  await PositionAssignmentModel.create({
    employeeProfileId: employees.salma._id,
    positionId: positions.librarianPos._id,
    departmentId: departments.libraryDept._id,
    startDate: new Date('2025-04-20'),
  });
  console.log('Position Assignments seeded.');

  console.log('Seeding Structure Change workflow...');
  const salesLeadRequest = await StructureChangeRequestModel.create({
      _id: new mongoose.Types.ObjectId(),
    requestNumber: 'SCR-2025-001',
    requestedByEmployeeId: employees.alice._id,
    requestType: StructureRequestType.NEW_POSITION,
    targetDepartmentId: departments.salesDept._id,
    details: 'Create a Sales Lead position to manage regional reps.',
    reason: 'Sales expansion',
    status: StructureRequestStatus.SUBMITTED,
    submittedByEmployeeId: employees.alice._id,
    submittedAt: new Date('2025-02-01'),
  });

  await StructureApprovalModel.create({
      _id: new mongoose.Types.ObjectId(),
    changeRequestId: salesLeadRequest._id,
    approverEmployeeId: employees.bob._id,
    decision: ApprovalDecision.PENDING,
    comments: 'Pending finance alignment',
  });

  await StructureChangeLogModel.create({
      _id: new mongoose.Types.ObjectId(),
    action: ChangeLogAction.CREATED,
    entityType: 'Position',
    entityId: positions.salesRepPos._id,
    performedByEmployeeId: employees.alice._id,
    summary: 'Requested upgrade for Sales Representative track',
    beforeSnapshot: {
      title: 'Sales Representative',
      departmentId: departments.salesDept._id,
    },
    afterSnapshot: {
      title: 'Sales Lead',
      departmentId: departments.salesDept._id,
    },
  });
  console.log('Structure Change workflow seeded.');
}
