import mongoose from 'mongoose';
import { JobTemplateSchema } from './models/job-template.schema';
import { JobRequisitionSchema } from './models/job-requisition.schema';
import { ApplicationSchema } from './models/application.schema';
import { CandidateSchema } from '../employee-profile/models/candidate.schema';
import { ApplicationStage } from './enums/application-stage.enum';
import { ApplicationStatus } from './enums/application-status.enum';

export async function seedRecruitment(connection: mongoose.Connection, employees: any, departments: any) {
  const JobTemplateModel = connection.model('JobTemplate', JobTemplateSchema);
  const JobRequisitionModel = connection.model('JobRequisition', JobRequisitionSchema);
  const ApplicationModel = connection.model('Application', ApplicationSchema);
  const CandidateModel = connection.model('Candidate', CandidateSchema);

  console.log('Clearing Recruitment Data...');
  await JobTemplateModel.deleteMany({});
  await JobRequisitionModel.deleteMany({});
  await ApplicationModel.deleteMany({});
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
  const candidateJohn = await CandidateModel.create({
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    nationalId: 'NAT-JOHN-001',
    candidateNumber: 'CAND-001',
    email: 'john.doe@example.com',
    phone: '1234567890',
    resumeUrl: 'http://example.com/resume.pdf',
  });
  console.log('Candidates seeded.');

  console.log('Seeding Applications...');
  await ApplicationModel.create({
    candidateId: candidateJohn._id,
    requisitionId: seRequisition._id,
    currentStage: ApplicationStage.SCREENING,
    status: ApplicationStatus.SUBMITTED,
  });
  console.log('Applications seeded.');

  return {
    templates: { softwareEngineerTemplate, hrManagerTemplate },
    requisitions: { seRequisition },
    candidates: { candidateJohn },
  };
}
