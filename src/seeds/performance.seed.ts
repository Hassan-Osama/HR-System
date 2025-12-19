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
  const templateScaleById = new Map<string, AppraisalRatingScaleType>();

  const annualTemplate = await AppraisalTemplateModel.create({
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

  const semiAnnualTemplate = await AppraisalTemplateModel.create({
    name: 'Semi-Annual Review Template 2025',
    description: 'Mid-year review template',
    templateType: AppraisalTemplateType.SEMI_ANNUAL,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.THREE_POINT,
      min: 1,
      max: 3,
      step: 1,
      labels: [
        'Below Expectations',
        'Meets Expectations',
        'Exceeds Expectations',
      ],
    },
    criteria: [
      {
        key: 'collaboration',
        title: 'Collaboration',
        details: 'Works effectively with peers.',
        weight: 50,
        required: true,
      },
      {
        key: 'delivery',
        title: 'Delivery',
        details: 'Delivers on commitments.',
        weight: 50,
        required: true,
      },
    ],
  });

  const probationaryTemplate = await AppraisalTemplateModel.create({
    name: 'Probationary Review Template',
    description: 'Probation period review template',
    templateType: AppraisalTemplateType.PROBATIONARY,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.TEN_POINT,
      min: 1,
      max: 10,
      step: 1,
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
    criteria: [
      {
        key: 'learning_curve',
        title: 'Learning Curve',
        details: 'Speed of onboarding and learning.',
        weight: 50,
        required: true,
      },
      {
        key: 'culture_fit',
        title: 'Culture Fit',
        details: 'Alignment with company values.',
        weight: 50,
        required: true,
      },
    ],
  });

  const projectTemplate = await AppraisalTemplateModel.create({
    name: 'Project Review Template',
    description: 'Project-specific review template',
    templateType: AppraisalTemplateType.PROJECT,
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
        key: 'delivery_quality',
        title: 'Delivery Quality',
        weight: 60,
        required: true,
      },
      {
        key: 'stakeholder_mgmt',
        title: 'Stakeholder Management',
        weight: 40,
        required: true,
      },
    ],
  });

  const adHocTemplate = await AppraisalTemplateModel.create({
    name: 'Ad Hoc Review Template',
    description: 'On-demand performance review template',
    templateType: AppraisalTemplateType.AD_HOC,
    isActive: true,
    ratingScale: {
      type: AppraisalRatingScaleType.THREE_POINT,
      min: 1,
      max: 3,
      step: 1,
      labels: [
        'Below Expectations',
        'Meets Expectations',
        'Exceeds Expectations',
      ],
    },
    criteria: [
      {
        key: 'responsiveness',
        title: 'Responsiveness',
        weight: 50,
        required: true,
      },
      {
        key: 'ownership',
        title: 'Ownership',
        weight: 50,
        required: true,
      },
    ],
  });

  [
    annualTemplate,
    semiAnnualTemplate,
    probationaryTemplate,
    projectTemplate,
    adHocTemplate,
  ].forEach((tmpl) =>
    templateScaleById.set(tmpl._id.toString(), tmpl.ratingScale.type),
  );

  const annualCycle = await AppraisalCycleModel.create({
    name: '2025 Annual Review Cycle',
    description: 'Performance review for the year 2025',
    cycleType: AppraisalTemplateType.ANNUAL,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: AppraisalCycleStatus.PLANNED,
    templateAssignments: [
      {
        templateId: annualTemplate._id,
        departmentIds: [
          departments.hrDept._id,
          departments.engDept._id,
          departments.salesDept._id,
        ],
      },
    ],
  });

  const activeCycle = await AppraisalCycleModel.create({
    name: '2025 Midyear Cycle',
    description: 'Semi-annual active cycle',
    cycleType: AppraisalTemplateType.SEMI_ANNUAL,
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-30'),
    status: AppraisalCycleStatus.ACTIVE,
    templateAssignments: [
      {
        templateId: semiAnnualTemplate._id,
        departmentIds: [departments.engDept._id],
      },
    ],
    publishedAt: new Date('2025-06-01'),
  });

  const closedCycle = await AppraisalCycleModel.create({
    name: '2024 Probationary Cycle',
    description: 'Probationary cycle closed',
    cycleType: AppraisalTemplateType.PROBATIONARY,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    status: AppraisalCycleStatus.CLOSED,
    templateAssignments: [
      {
        templateId: probationaryTemplate._id,
        departmentIds: [departments.hrDept._id],
      },
    ],
    closedAt: new Date('2024-05-15'),
  });

  const archivedCycle = await AppraisalCycleModel.create({
    name: '2023 Project Cycle',
    description: 'Project cycle archived',
    cycleType: AppraisalTemplateType.PROJECT,
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-05-31'),
    status: AppraisalCycleStatus.ARCHIVED,
    templateAssignments: [
      {
        templateId: projectTemplate._id,
        departmentIds: [departments.salesDept._id],
      },
    ],
    archivedAt: new Date('2024-01-10'),
  });
  console.log('Performance Data seeded.');

  console.log('Seeding appraisal assignments and records...');
  const baseAssignments = await AppraisalAssignmentModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
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
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
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
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
      employeeProfileId: employees.alice._id,
      managerProfileId: employees.bob._id,
      departmentId: departments.hrDept._id,
      positionId: positions.hrManagerPos._id,
      status: AppraisalAssignmentStatus.IN_PROGRESS,
      assignedAt: new Date('2025-01-17'),
      dueDate: new Date('2025-02-28'),
    },
  ]);

  const additionalAssignments = await AppraisalAssignmentModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: activeCycle._id,
      templateId: semiAnnualTemplate._id,
      employeeProfileId: employees.bob._id,
      managerProfileId: employees.alice._id,
      departmentId: departments.engDept._id,
      positionId: positions.softwareEngPos._id,
      status: AppraisalAssignmentStatus.NOT_STARTED,
      assignedAt: new Date('2025-06-02'),
      dueDate: new Date('2025-06-30'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: closedCycle._id,
      templateId: probationaryTemplate._id,
      employeeProfileId: employees.alice._id,
      managerProfileId: employees.bob._id,
      departmentId: departments.hrDept._id,
      positionId: positions.hrManagerPos._id,
      status: AppraisalAssignmentStatus.SUBMITTED,
      assignedAt: new Date('2024-02-05'),
      dueDate: new Date('2024-04-15'),
      submittedAt: new Date('2024-04-10'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      cycleId: archivedCycle._id,
      templateId: projectTemplate._id,
      employeeProfileId: employees.charlie._id,
      managerProfileId: employees.alice._id,
      departmentId: departments.salesDept._id,
      positionId: positions.salesRepPos._id,
      status: AppraisalAssignmentStatus.ACKNOWLEDGED,
      assignedAt: new Date('2023-03-05'),
      dueDate: new Date('2023-05-15'),
      submittedAt: new Date('2023-05-10'),
      publishedAt: new Date('2023-05-20'),
    },
  ]);

  const baseRecords = await AppraisalRecordModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: baseAssignments[0]._id,
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
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
      assignmentId: baseAssignments[1]._id,
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
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
      assignmentId: baseAssignments[2]._id,
      cycleId: annualCycle._id,
      templateId: annualTemplate._id,
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

  const additionalRecords = await AppraisalRecordModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: additionalAssignments[0]._id,
      cycleId: activeCycle._id,
      templateId: semiAnnualTemplate._id,
      employeeProfileId: employees.bob._id,
      managerProfileId: employees.alice._id,
      ratings: [],
      status: AppraisalRecordStatus.DRAFT,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: additionalAssignments[1]._id,
      cycleId: closedCycle._id,
      templateId: probationaryTemplate._id,
      employeeProfileId: employees.alice._id,
      managerProfileId: employees.bob._id,
      ratings: [
        {
          key: 'learning_curve',
          title: 'Learning Curve',
          ratingValue: 8,
          ratingLabel: 'Strong',
        },
      ],
      status: AppraisalRecordStatus.MANAGER_SUBMITTED,
      managerSubmittedAt: new Date('2024-04-10'),
    },
    {
      _id: new mongoose.Types.ObjectId(),
      assignmentId: additionalAssignments[2]._id,
      cycleId: archivedCycle._id,
      templateId: projectTemplate._id,
      employeeProfileId: employees.charlie._id,
      managerProfileId: employees.alice._id,
      ratings: [
        {
          key: 'delivery_quality',
          title: 'Delivery Quality',
          ratingValue: 4,
          ratingLabel: 'Very Good',
        },
      ],
      status: AppraisalRecordStatus.ARCHIVED,
      archivedAt: new Date('2024-01-10'),
    },
  ]);

  await Promise.all(
    baseAssignments.map((assignment, idx) =>
      AppraisalAssignmentModel.updateOne(
        { _id: assignment._id },
        {
          latestAppraisalId: baseRecords[idx]._id,
          status: AppraisalAssignmentStatus.PUBLISHED,
        },
      ),
    ),
  );

  // Mirror the latest appraisal summary onto each employee profile that has a seeded record.
  await Promise.all(
    [...baseRecords, ...additionalRecords].map((record) =>
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
            lastAppraisalScaleType: templateScaleById.get(
              record.templateId.toString(),
            ),
            lastDevelopmentPlanSummary: record.managerSummary,
          },
        },
      ),
    ),
  );

  await AppraisalDisputeModel.create({
    _id: new mongoose.Types.ObjectId(),
    appraisalId: baseRecords[0]._id,
    assignmentId: baseAssignments[0]._id,
    cycleId: annualCycle._id,
    raisedByEmployeeId: employees.bob._id,
    reason: 'Clarify weighting for goal achievement',
    details: 'Requesting review of weight distribution.',
    status: AppraisalDisputeStatus.OPEN,
    assignedReviewerEmployeeId: employees.alice._id,
  });

  await AppraisalDisputeModel.create([
    {
      _id: new mongoose.Types.ObjectId(),
      appraisalId: additionalRecords[1]._id,
      assignmentId: additionalAssignments[1]._id,
      cycleId: closedCycle._id,
      raisedByEmployeeId: employees.alice._id,
      reason: 'Score clarification',
      status: AppraisalDisputeStatus.UNDER_REVIEW,
      assignedReviewerEmployeeId: employees.bob._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      appraisalId: additionalRecords[2]._id,
      assignmentId: additionalAssignments[2]._id,
      cycleId: archivedCycle._id,
      raisedByEmployeeId: employees.charlie._id,
      reason: 'Archived decision dispute',
      status: AppraisalDisputeStatus.ADJUSTED,
      resolutionSummary: 'Adjusted rating after review',
      resolvedAt: new Date('2024-02-01'),
      resolvedByEmployeeId: employees.alice._id,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      appraisalId: baseRecords[1]._id,
      assignmentId: baseAssignments[1]._id,
      cycleId: annualCycle._id,
      raisedByEmployeeId: employees.charlie._id,
      reason: 'Disagree with teamwork score',
      status: AppraisalDisputeStatus.REJECTED,
      resolvedAt: new Date('2025-03-10'),
      resolvedByEmployeeId: employees.alice._id,
    },
  ]);
}
