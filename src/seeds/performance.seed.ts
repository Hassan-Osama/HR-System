import mongoose from 'mongoose';
import { AppraisalCycleSchema } from '../performance/models/appraisal-cycle.schema';
import { AppraisalTemplateSchema } from '../performance/models/appraisal-template.schema';
import { AppraisalAssignmentSchema } from '../performance/models/appraisal-assignment.schema';
import { AppraisalRecordSchema } from '../performance/models/appraisal-record.schema';
import { AppraisalDisputeSchema } from '../performance/models/appraisal-dispute.schema';
import { EmployeeProfileSchema } from '../employee-profile/models/employee-profile.schema';
import {
  AppraisalTemplateType,
  AppraisalRatingScaleType,
  AppraisalCycleStatus,
  AppraisalAssignmentStatus,
  AppraisalRecordStatus,
  AppraisalDisputeStatus,
} from '../performance/enums/performance.enums';

type SeedRef = { _id: mongoose.Types.ObjectId };
type SeedDepartments = {
  hrDept: SeedRef;
  engDept: SeedRef;
  salesDept: SeedRef;
};
type SeedEmployees = { alice: SeedRef; bob: SeedRef; charlie: SeedRef };
type SeedPositions = {
  hrManagerPos: SeedRef;
  softwareEngPos: SeedRef;
  salesRepPos: SeedRef;
};

export async function seedPerformance(
  connection: mongoose.Connection,
  departments: SeedDepartments,
  employees: SeedEmployees,
  positions: SeedPositions,
) {
  const AppraisalCycleModel = connection.model(
    'AppraisalCycle',
    AppraisalCycleSchema,
  );
  const AppraisalTemplateModel = connection.model(
    'AppraisalTemplate',
    AppraisalTemplateSchema,
  );
  const AppraisalAssignmentModel = connection.model(
    'AppraisalAssignment',
    AppraisalAssignmentSchema,
  );
  const AppraisalRecordModel = connection.model(
    'AppraisalRecord',
    AppraisalRecordSchema,
  );
  const AppraisalDisputeModel = connection.model(
    'AppraisalDispute',
    AppraisalDisputeSchema,
  );
  const EmployeeProfileModel = connection.model(
    'EmployeeProfile',
    EmployeeProfileSchema,
  );

  console.log('Clearing Performance Data...');
  await AppraisalCycleModel.deleteMany({});
  await AppraisalTemplateModel.deleteMany({});
  await AppraisalAssignmentModel.deleteMany({});
  await AppraisalRecordModel.deleteMany({});
  await AppraisalDisputeModel.deleteMany({});

  console.log('Seeding Performance Data...');
  const template = await AppraisalTemplateModel.create({
    name: 'Annual Review Template 2025',
    description: 'Standard annual review template',
    templateType: AppraisalTemplateType.ANNUAL,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.FIVE_POINT,
      min: 1,
      max: 5,
      step: 1,
      labels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    },
    criteria: [
      {
        key: 'integrity',
        title: 'Integrity',
        details: 'Demonstrates honesty and ethical behavior.',
        weight: 30,
        required: true,
      },
      {
        key: 'teamwork',
        title: 'Teamwork',
        details: 'Collaborates effectively across teams.',
        weight: 30,
        required: true,
      },
      {
        key: 'goal_achievement',
        title: 'Goal Achievement',
        details: 'Meets or exceeds assigned objectives.',
        weight: 40,
        required: true,
      },
    ],
    instructions:
      'Complete each criterion with ratings and narrative comments.',
  });

  const cycle = await AppraisalCycleModel.create({
    name: '2025 Annual Review Cycle',
    description: 'Performance review for the year 2025',
    cycleType: AppraisalTemplateType.ANNUAL,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: AppraisalCycleStatus.PLANNED,
    templateAssignments: [
      {
        templateId: template._id,
        departmentIds: [
          departments.hrDept._id,
          departments.engDept._id,
          departments.salesDept._id,
        ],
      },
    ],
  });
  console.log('Performance Data seeded.');

  console.log('Seeding appraisal assignments and records...');
  const assignments = await AppraisalAssignmentModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.bob._id,
      managerProfileId: employees.alice._id,
      departmentId: departments.engDept._id,
      positionId: positions.softwareEngPos._id,
      status: AppraisalAssignmentStatus.IN_PROGRESS,
      assignedAt: new Date('2025-01-15'),
      dueDate: new Date('2025-02-28'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.charlie._id,
      managerProfileId: employees.alice._id,
      departmentId: departments.salesDept._id,
      positionId: positions.salesRepPos._id,
      status: AppraisalAssignmentStatus.IN_PROGRESS,
      assignedAt: new Date('2025-01-16'),
      dueDate: new Date('2025-02-28'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.alice._id,
      managerProfileId: employees.bob._id,
      departmentId: departments.hrDept._id,
      positionId: positions.hrManagerPos._id,
      status: AppraisalAssignmentStatus.IN_PROGRESS,
      assignedAt: new Date('2025-01-17'),
      dueDate: new Date('2025-02-28'),
    },
  ]);

  const records = await AppraisalRecordModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: assignments[0]._id,
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.bob._id,
      managerProfileId: employees.alice._id,
      ratings: [
        {
          key: 'integrity',
          title: 'Integrity',
          ratingValue: 4,
          ratingLabel: 'Very Good',
          weightedScore: 1.2,
        },
        {
          key: 'teamwork',
          title: 'Teamwork',
          ratingValue: 5,
          ratingLabel: 'Excellent',
          weightedScore: 1.5,
        },
        {
          key: 'goal_achievement',
          title: 'Goal Achievement',
          ratingValue: 4,
          ratingLabel: 'Very Good',
          weightedScore: 1.6,
        },
      ],
      totalScore: 4.3,
      overallRatingLabel: 'Exceeds Expectations',
      managerSummary: 'Consistently delivers high-quality work.',
      strengths: 'Ownership, mentoring junior devs',
      improvementAreas: 'Document more design decisions',
      status: AppraisalRecordStatus.HR_PUBLISHED,
      managerSubmittedAt: new Date('2025-03-01'),
      hrPublishedAt: new Date('2025-03-05'),
      publishedByEmployeeId: employees.alice._id,
      employeeViewedAt: new Date('2025-03-06'),
      employeeAcknowledgedAt: new Date('2025-03-07'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: assignments[1]._id,
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.charlie._id,
      managerProfileId: employees.alice._id,
      ratings: [
        {
          key: 'integrity',
          title: 'Integrity',
          ratingValue: 3,
          ratingLabel: 'Good',
          weightedScore: 0.9,
        },
        {
          key: 'teamwork',
          title: 'Teamwork',
          ratingValue: 4,
          ratingLabel: 'Very Good',
          weightedScore: 1.2,
        },
        {
          key: 'goal_achievement',
          title: 'Goal Achievement',
          ratingValue: 3,
          ratingLabel: 'Good',
          weightedScore: 1.2,
        },
      ],
      totalScore: 3.3,
      overallRatingLabel: 'Meets Expectations',
      managerSummary: 'Solid contributor; focus on pipeline consistency.',
      strengths: 'Client rapport, responsiveness',
      improvementAreas: 'Improve forecasting accuracy',
      status: AppraisalRecordStatus.HR_PUBLISHED,
      managerSubmittedAt: new Date('2025-03-02'),
      hrPublishedAt: new Date('2025-03-06'),
      publishedByEmployeeId: employees.alice._id,
      employeeViewedAt: new Date('2025-03-07'),
      employeeAcknowledgedAt: new Date('2025-03-08'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: assignments[2]._id,
      cycleId: cycle._id,
      templateId: template._id,
      employeeProfileId: employees.alice._id,
      managerProfileId: employees.bob._id,
      ratings: [
        {
          key: 'integrity',
          title: 'Integrity',
          ratingValue: 5,
          ratingLabel: 'Excellent',
          weightedScore: 1.5,
        },
        {
          key: 'teamwork',
          title: 'Teamwork',
          ratingValue: 5,
          ratingLabel: 'Excellent',
          weightedScore: 1.5,
        },
        {
          key: 'goal_achievement',
          title: 'Goal Achievement',
          ratingValue: 5,
          ratingLabel: 'Excellent',
          weightedScore: 2,
        },
      ],
      totalScore: 5,
      overallRatingLabel: 'Outstanding',
      managerSummary: 'Sets the bar for leadership and delivery.',
      strengths: 'Strategic planning, coaching',
      improvementAreas: 'Delegate more tactical tasks',
      status: AppraisalRecordStatus.HR_PUBLISHED,
      managerSubmittedAt: new Date('2025-03-03'),
      hrPublishedAt: new Date('2025-03-07'),
      publishedByEmployeeId: employees.bob._id,
      employeeViewedAt: new Date('2025-03-08'),
      employeeAcknowledgedAt: new Date('2025-03-09'),
    },
  ]);

  await Promise.all(
    assignments.map((assignment, idx) =>
      AppraisalAssignmentModel.updateOne(
        { _id: assignment._id },
        {
          latestAppraisalId: records[idx]._id,
          status: AppraisalAssignmentStatus.PUBLISHED,
        },
      ),
    ),
  );

  // Mirror the latest appraisal summary onto each employee profile that has a seeded record.
  await Promise.all(
    records.map((record) =>
      EmployeeProfileModel.updateOne(
        { _id: record.employeeProfileId },
        {
          $set: {
            lastAppraisalRecordId: record._id,
            lastAppraisalCycleId: record.cycleId,
            lastAppraisalTemplateId: record.templateId,
            lastAppraisalDate:
              record.managerSubmittedAt ?? record.hrPublishedAt,
            lastAppraisalScore: record.totalScore,
            lastAppraisalRatingLabel: record.overallRatingLabel,
            lastAppraisalScaleType: template.ratingScale.type,
            lastDevelopmentPlanSummary: record.managerSummary,
          },
        },
      ),
    ),
  );

  await AppraisalDisputeModel.create({
    _id: new mongoose.Types.ObjectId(),
    appraisalId: records[0]._id,
    assignmentId: assignments[0]._id,
    cycleId: cycle._id,
    raisedByEmployeeId: employees.bob._id,
    reason: 'Clarify weighting for goal achievement',
    details: 'Requesting review of weight distribution.',
    status: AppraisalDisputeStatus.OPEN,
    assignedReviewerEmployeeId: employees.alice._id,
  });
}
