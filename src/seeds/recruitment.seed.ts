import mongoose from 'mongoose';
import { JobTemplateSchema } from '../recruitment/models/job-template.schema';
import { JobRequisitionSchema } from '../recruitment/models/job-requisition.schema';
import { ApplicationSchema } from '../recruitment/models/application.schema';
import { ApplicationStatusHistorySchema } from '../recruitment/models/application-history.schema';
import { AssessmentResultSchema } from '../recruitment/models/assessment-result.schema';
import { ClearanceChecklistSchema } from '../recruitment/models/clearance-checklist.schema';
import { ContractSchema } from '../recruitment/models/contract.schema';
import { DocumentSchema } from '../recruitment/models/document.schema';
import { InterviewSchema } from '../recruitment/models/interview.schema';
import { OfferSchema } from '../recruitment/models/offer.schema';
import { OnboardingSchema } from '../recruitment/models/onboarding.schema';
import { ReferralSchema } from '../recruitment/models/referral.schema';
import { TerminationRequestSchema } from '../recruitment/models/termination-request.schema';
import { CandidateSchema } from '../employee-profile/models/candidate.schema';
import { CandidateStatus } from '../employee-profile/enums/employee-profile.enums';
import { ApplicationStage } from '../recruitment/enums/application-stage.enum';
import { ApplicationStatus } from '../recruitment/enums/application-status.enum';
import { DocumentType } from '../recruitment/enums/document-type.enum';
import { InterviewMethod } from '../recruitment/enums/interview-method.enum';
import { InterviewStatus } from '../recruitment/enums/interview-status.enum';
import { OfferResponseStatus } from '../recruitment/enums/offer-response-status.enum';
import { OfferFinalStatus } from '../recruitment/enums/offer-final-status.enum';
import { ApprovalStatus } from '../recruitment/enums/approval-status.enum';
import { OnboardingTaskStatus } from '../recruitment/enums/onboarding-task-status.enum';
import { TerminationInitiation } from '../recruitment/enums/termination-initiation.enum';
import { TerminationStatus } from '../recruitment/enums/termination-status.enum';

type SeedEmployees = {
  alice: { _id: mongoose.Types.ObjectId };
  bob: { _id: mongoose.Types.ObjectId };
  charlie: { _id: mongoose.Types.ObjectId };
};

type SeedDepartments = {
  hrDept: { _id: mongoose.Types.ObjectId };
  engDept: { _id: mongoose.Types.ObjectId };
  salesDept: { _id: mongoose.Types.ObjectId };
};

type SeedPositions = {
  hrManagerPos: { _id: mongoose.Types.ObjectId };
  softwareEngPos: { _id: mongoose.Types.ObjectId };
  salesRepPos: { _id: mongoose.Types.ObjectId };
};

export async function seedRecruitment(
  connection: mongoose.Connection,
  employees: SeedEmployees,
  departments: SeedDepartments,
  positions: SeedPositions,
) {
  const JobTemplateModel = connection.model('JobTemplate', JobTemplateSchema);
  const JobRequisitionModel = connection.model(
    'JobRequisition',
    JobRequisitionSchema,
  );
  const ApplicationModel = connection.model('Application', ApplicationSchema);
  const ApplicationHistoryModel = connection.model(
    'ApplicationStatusHistory',
    ApplicationStatusHistorySchema,
  );
  const AssessmentResultModel = connection.model(
    'AssessmentResult',
    AssessmentResultSchema,
  );
  const ClearanceChecklistModel = connection.model(
    'ClearanceChecklist',
    ClearanceChecklistSchema,
  );
  const ContractModel = connection.model('Contract', ContractSchema);
  const DocumentModel = connection.model('Document', DocumentSchema);
  const InterviewModel = connection.model('Interview', InterviewSchema);
  const OfferModel = connection.model('Offer', OfferSchema);
  const OnboardingModel = connection.model('Onboarding', OnboardingSchema);
  const ReferralModel = connection.model('Referral', ReferralSchema);
  const TerminationRequestModel = connection.model(
    'TerminationRequest',
    TerminationRequestSchema,
  );
  const CandidateModel = connection.model('Candidate', CandidateSchema);

  console.log('Clearing Recruitment Data...');
  await JobTemplateModel.deleteMany({});
  await JobRequisitionModel.deleteMany({});
  await ApplicationModel.deleteMany({});
  await ApplicationHistoryModel.deleteMany({});
  await AssessmentResultModel.deleteMany({});
  await ClearanceChecklistModel.deleteMany({});
  await ContractModel.deleteMany({});
  await DocumentModel.deleteMany({});
  await InterviewModel.deleteMany({});
  await OfferModel.deleteMany({});
  await OnboardingModel.deleteMany({});
  await ReferralModel.deleteMany({});
  await TerminationRequestModel.deleteMany({});
  await CandidateModel.deleteMany({});

  console.log('Seeding Job Templates...');
  const softwareEngineerTemplate = await JobTemplateModel.create({
    title: 'Software Engineer',
    department: 'Engineering',
    qualifications: ['BS in Computer Science'],
    skills: ['Node.js', 'TypeScript', 'MongoDB'],
    description: 'Develop and maintain software applications.',
  });

  const hrManagerTemplate = await JobTemplateModel.create({
    title: 'HR Manager',
    department: 'Human Resources',
    qualifications: ['BA in Human Resources'],
    skills: ['Communication', 'Labor Law'],
    description: 'Manage HR operations.',
  });
  console.log('Job Templates seeded.');

  console.log('Seeding Job Requisitions...');
  const seRequisition = await JobRequisitionModel.create({
    requisitionId: 'REQ-001',
    templateId: softwareEngineerTemplate._id,
    openings: 2,
    location: 'Cairo',
    hiringManagerId: employees.alice._id, // Assuming Alice is a manager
    publishStatus: 'published',
    postingDate: new Date(),
  });
  console.log('Job Requisitions seeded.');

  console.log('Seeding Candidates...');
  const [candidateJohn, candidateSara, candidateOmar] =
    await CandidateModel.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        nationalId: 'NAT-JOHN-001',
        password: 'password123',
        candidateNumber: 'CAND-001',
        personalEmail: 'john.doe@example.com',
        mobilePhone: '1234567890',
        departmentId: departments.engDept._id,
        positionId: positions.softwareEngPos._id,
        status: CandidateStatus.SCREENING,
        resumeUrl: 'http://example.com/resume.pdf',
        notes: 'Referred by Bob for SWE role.',
      },
      {
        firstName: 'Sara',
        lastName: 'Kim',
        fullName: 'Sara Kim',
        nationalId: 'NAT-SARA-002',
        password: 'password123',
        candidateNumber: 'CAND-002',
        personalEmail: 'sara.kim@example.com',
        mobilePhone: '9876543210',
        departmentId: departments.hrDept._id,
        positionId: positions.hrManagerPos._id,
        status: CandidateStatus.APPLIED,
        resumeUrl: 'http://example.com/resume-sara-kim.pdf',
        notes: 'HR generalist with policy experience.',
      },
      {
        firstName: 'Omar',
        lastName: 'Nasser',
        fullName: 'Omar Nasser',
        nationalId: 'NAT-OMAR-003',
        password: 'password123',
        candidateNumber: 'CAND-003',
        personalEmail: 'omar.nasser@example.com',
        mobilePhone: '5554443333',
        departmentId: departments.salesDept._id,
        positionId: positions.salesRepPos._id,
        status: CandidateStatus.INTERVIEW,
        applicationDate: new Date('2025-01-10'),
        resumeUrl: 'http://example.com/resume-omar-nasser.pdf',
        notes: 'SaaS sales background; pipeline-focused.',
      },
    ]);
  console.log('Candidates seeded.');

  console.log('Seeding Applications...');
  const application = await ApplicationModel.create({
    candidateId: candidateJohn._id,
    requisitionId: seRequisition._id,
    currentStage: ApplicationStage.SCREENING,
    status: ApplicationStatus.SUBMITTED,
  });
  console.log('Applications seeded.');

  console.log('Seeding application history and interviews...');
  await ApplicationHistoryModel.create({
    applicationId: application._id,
    oldStage: ApplicationStage.SCREENING,
    newStage: ApplicationStage.HR_INTERVIEW,
    oldStatus: ApplicationStatus.SUBMITTED,
    newStatus: ApplicationStatus.IN_PROCESS,
    changedBy: employees.alice._id,
  });

  const interview = await InterviewModel.create({
    applicationId: application._id,
    stage: ApplicationStage.HR_INTERVIEW,
    scheduledDate: new Date('2025-02-10T10:00:00Z'),
    method: InterviewMethod.VIDEO,
    panel: [employees.alice._id],
    videoLink: 'https://meet.example.com/interview-001',
    status: InterviewStatus.COMPLETED,
  });

  const assessment = await AssessmentResultModel.create({
    interviewId: interview._id,
    interviewerId: employees.alice._id,
    score: 4.5,
    comments: 'Strong technical depth and communication.',
  });

  await InterviewModel.updateOne(
    { _id: interview._id },
    { feedbackId: assessment._id },
  );

  console.log('Seeding referral and documents...');
  const referral = await ReferralModel.create({
    referringEmployeeId: employees.bob._id,
    candidateId: candidateJohn._id,
    role: 'Software Engineer',
    level: 'Mid-level',
  });

  const resumeDoc = await DocumentModel.create({
    ownerId: employees.bob._id,
    type: DocumentType.CV,
    filePath: '/docs/candidates/john-doe-cv.pdf',
    uploadedAt: new Date('2025-01-05'),
  });

  console.log('Seeding offer and contract...');
  const offer = await OfferModel.create({
    applicationId: application._id,
    candidateId: candidateJohn._id,
    hrEmployeeId: employees.alice._id,
    grossSalary: 18000,
    signingBonus: 3000,
    benefits: ['Medical', 'Stock Options'],
    role: 'Software Engineer',
    deadline: new Date('2025-02-20'),
    applicantResponse: OfferResponseStatus.ACCEPTED,
    approvers: [
      {
        employeeId: employees.alice._id,
        role: 'HR Manager',
        status: ApprovalStatus.APPROVED,
        actionDate: new Date('2025-02-11'),
      },
    ],
    finalStatus: OfferFinalStatus.APPROVED,
    candidateSignedAt: new Date('2025-02-12'),
    hrSignedAt: new Date('2025-02-12'),
  });

  const contractDocument = await DocumentModel.create({
    ownerId: employees.alice._id,
    type: DocumentType.CONTRACT,
    filePath: '/docs/contracts/john-doe-2025.pdf',
    uploadedAt: new Date('2025-02-12'),
  });

  const contract = await ContractModel.create({
    offerId: offer._id,
    acceptanceDate: new Date('2025-02-12'),
    grossSalary: 18000,
    signingBonus: 3000,
    role: 'Software Engineer',
    benefits: ['Medical', 'Stock Options'],
    documentId: contractDocument._id,
    employeeSignedAt: new Date('2025-02-12'),
    employerSignedAt: new Date('2025-02-12'),
  });

  console.log('Seeding onboarding and termination flow...');
  await OnboardingModel.create({
    employeeId: employees.bob._id,
    contractId: contract._id,
    tasks: [
      {
        name: 'Submit documents',
        department: 'HR',
        status: OnboardingTaskStatus.COMPLETED,
        deadline: new Date('2025-02-20'),
        completedAt: new Date('2025-02-15'),
        documentId: resumeDoc._id,
      },
      {
        name: 'IT setup',
        department: 'IT',
        status: OnboardingTaskStatus.IN_PROGRESS,
        deadline: new Date('2025-02-25'),
      },
    ],
    completed: false,
  });

  const terminationRequest = await TerminationRequestModel.create({
    employeeId: employees.charlie._id,
    initiator: TerminationInitiation.HR,
    reason: 'Performance issues',
    hrComments: 'Eligible for partial benefits',
    status: TerminationStatus.UNDER_REVIEW,
    terminationDate: new Date('2025-03-15'),
    contractId: contract._id,
  });

  await ClearanceChecklistModel.create({
    terminationId: terminationRequest._id,
    items: [
      {
        department: 'IT',
        status: ApprovalStatus.PENDING,
      },
      {
        department: 'Finance',
        status: ApprovalStatus.APPROVED,
        updatedBy: employees.alice._id,
        updatedAt: new Date('2025-03-10'),
      },
    ],
    equipmentList: [
      {
        name: 'Laptop',
        returned: true,
        condition: 'Good',
      },
    ],
    cardReturned: false,
  });

  return {
    templates: { softwareEngineerTemplate, hrManagerTemplate },
    requisitions: { seRequisition },
    candidates: { candidateJohn, candidateSara, candidateOmar },
    referral,
    application,
    interview,
    assessment,
    offer,
    contract,
    terminationRequest,
  };
}
