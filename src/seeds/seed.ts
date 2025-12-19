import mongoose from 'mongoose';
import {
  seedOrganizationStructure,
  seedPositionAssignments,
} from './organization-structure.seed';
import { seedEmployeeProfile } from './employee-profile.seed';
import { seedPerformance } from './performance.seed';
import { seedPayrollConfiguration } from './payroll-configuration.seed';
import { seedTimeManagement } from './time-management.seed';
import { seedPayrollExecution } from './payroll-execution.seed';
import { seedPayrollTracking } from './payroll-tracking.seed';
import { seedLeaves } from './leaves.seed';
import { seedRecruitment } from './recruitment.seed';

async function seed() {
  const mongoUri = 'mongodb://localhost:27017/hr-system';

  console.log(`Connecting to MongoDB at ${mongoUri}...`);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  try {
    // 1. Seed Organization Structure (Departments & Positions)
    const { departments, positions } = await seedOrganizationStructure(
      mongoose.connection,
    );

    // 2. Seed Employee Profiles
    const employees = await seedEmployeeProfile(
      mongoose.connection,
      departments,
      positions,
    );

    // 3. Seed Position Assignments
    await seedPositionAssignments(
      mongoose.connection,
      employees,
      positions,
      departments,
    );

    // 4. Seed Performance Data
    await seedPerformance(
      mongoose.connection,
      departments,
      employees,
      positions,
    );

    // 5. Seed Payroll Configuration
    const payrollConfig = await seedPayrollConfiguration(
      mongoose.connection,
      employees,
    );

    // 5.1 Update Employees with Pay Grades
    console.log('Assigning Pay Grades to Employees...');
    const EmployeeProfileModel = mongoose.connection.model('EmployeeProfile');

    await EmployeeProfileModel.updateOne(
      { _id: employees.alice._id },
      { $set: { payGradeId: payrollConfig.payGrades.seniorGrade._id } },
    );

    await EmployeeProfileModel.updateOne(
      { _id: employees.bob._id },
      { $set: { payGradeId: payrollConfig.payGrades.seniorGrade._id } },
    );

    await EmployeeProfileModel.updateOne(
      { _id: employees.charlie._id },
      { $set: { payGradeId: payrollConfig.payGrades.juniorGrade._id } },
    );
    console.log('Pay Grades assigned.');

    // 6. Seed Time Management
    await seedTimeManagement(
      mongoose.connection,
      employees,
      departments,
      positions,
    );

    // 7. Seed Leaves (calendar/attachments/adjustments depend on employees/time data)
    await seedLeaves(mongoose.connection, employees);

    // 8. Seed Recruitment (documents, offers, termination links)
    const recruitmentData = await seedRecruitment(
      mongoose.connection,
      employees,
      departments,
      positions,
    );

    // 9. Seed Payroll Execution (requires recruitment data for termination references)
    const payrollExecution = await seedPayrollExecution(
      mongoose.connection,
      employees,
      payrollConfig,
      recruitmentData,
    );

    // 10. Seed Payroll Tracking
    await seedPayrollTracking(mongoose.connection, employees, payrollExecution);

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed();
