# Recruitment Subsystem

## Models

### Candidate

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| firstName | string | Given name | Yes | John; Sara; Omar |
| lastName | string | Family name | Yes | Doe; Kim; Nasser |
| fullName | string | Full name | Yes | John Doe; Sara Kim; Omar Nasser |
| nationalId | string | National identifier | Yes | NAT-JOHN-001; NAT-SARA-002; NAT-OMAR-003 |
| password | string | Auth password | Yes | password123 (all) |
| candidateNumber | string | Candidate code | Yes | CAND-001; CAND-002; CAND-003 |
| resumeUrl | string | Resume URL | Yes | <http://example.com/resume.pdf>; <http://example.com/resume-sara-kim.pdf>; <http://example.com/resume-omar-nasser.pdf> |
| personalEmail | string | Personal email | Yes | <john.doe@example.com>; <sara.kim@example.com>; <omar.nasser@example.com> |
| mobilePhone | string | Mobile phone | Yes | 1234567890; 9876543210; 5554443333 |
| middleName | string | Middle name | No | Not found in seed files |
| gender | enum(Gender) | Gender | No | Not found in seed files |
| maritalStatus | enum(MaritalStatus) | Marital status | No | Not found in seed files |
| dateOfBirth | Date | Birth date | No | Not found in seed files |
| homePhone | string | Home phone | No | Not found in seed files |
| address | Address | Address | No | Not found in seed files |
| profilePictureUrl | string | Profile picture | No | Not found in seed files |
| accessProfileId | ObjectId | Access profile | No | Not found in seed files |
| departmentId | ObjectId | Department ref | Yes | departments.engDept._id; departments.hrDept._id; departments.salesDept._id |
| positionId | ObjectId | Position ref | Yes | positions.softwareEngPos._id; positions.hrManagerPos._id; positions.salesRepPos._id |
| applicationDate | Date | Application date | Yes | 2025-01-10 (Omar) |
| status | enum(CandidateStatus) | Candidate status | Yes | SCREENING (John); APPLIED (Sara); INTERVIEW (Omar) |
| notes | string | Notes | Yes | Referred by Bob for SWE role.; HR generalist with policy experience.; SaaS sales background; pipeline-focused. |

### JobTemplate

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| title | string | Role title | Yes | Software Engineer; HR Manager |
| department | string | Department name | Yes | Engineering; Human Resources |
| qualifications | string[] | Required qualifications | Yes | ['BS in Computer Science']; ['BA in Human Resources'] |
| skills | string[] | Required skills | Yes | ['Node.js', 'TypeScript', 'MongoDB']; ['Communication', 'Labor Law'] |
| description | string | Role description | Yes | Develop and maintain software applications.; Manage HR operations. |

### JobRequisition

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| requisitionId | string | Requisition code | Yes | REQ-001 |
| templateId | ObjectId | Template ref | Yes | softwareEngineerTemplate._id |
| openings | number | Open headcount | Yes | 2 |
| location | string | Location | Yes | Cairo |
| hiringManagerId | ObjectId | Hiring manager ref | Yes | employees.alice._id |
| publishStatus | string | Publish status | Yes | published |
| postingDate | Date | Posting date | Yes | Current date at seeding |
| expiryDate | Date | Expiry date | No | Not found in seed files |

### Application

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| candidateId | ObjectId | Candidate ref | Yes | candidateJohn._id |
| requisitionId | ObjectId | Requisition ref | Yes | seRequisition._id |
| currentStage | enum(ApplicationStage) | Current stage | Yes | SCREENING |
| status | enum(ApplicationStatus) | Application status | Yes | SUBMITTED |
| assignedHr | ObjectId | Assigned HR | No | Not found in seed files |

### ApplicationStatusHistory

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| applicationId | ObjectId | Application ref | Yes | application._id |
| oldStage | string | Previous stage | Yes | SCREENING |
| newStage | string | New stage | Yes | HR_INTERVIEW |
| oldStatus | string | Previous status | Yes | SUBMITTED |
| newStatus | string | New status | Yes | IN_PROCESS |
| changedBy | ObjectId | Changed by | Yes | employees.alice._id |

### AssessmentResult

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| interviewId | ObjectId | Interview ref | Yes | interview._id |
| interviewerId | ObjectId | Interviewer ref | Yes | employees.alice._id |
| score | number | Assessment score | Yes | 4.5 |
| comments | string | Comments | Yes | Strong technical depth and communication. |

### ClearanceChecklist

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| terminationId | ObjectId | Termination ref | Yes | terminationRequest._id |
| items | array | Department approvals | Yes | IT (PENDING); Finance (APPROVED, updatedBy: employees.alice._id, updatedAt: 2025-03-10) |
| equipmentList | array | Equipment return list | Yes | [{ name: Laptop, returned: true, condition: Good }] |
| cardReturned | boolean | Access card returned | Yes | false |
| equipmentList.equipmentId | ObjectId | Equipment id | No | Not found in seed files |
| items.comments | string | Comments | No | Not found in seed files (optional) |

### Contract

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| offerId | ObjectId | Offer ref | Yes | offer._id |
| acceptanceDate | Date | Acceptance date | Yes | 2025-02-12 |
| grossSalary | number | Gross salary | Yes | 18000 |
| signingBonus | number | Signing bonus | Yes | 3000 |
| role | string | Role | Yes | Software Engineer |
| benefits | string[] | Benefits | Yes | ['Medical', 'Stock Options'] |
| documentId | ObjectId | Contract document | Yes | contractDocument._id |
| employeeSignedAt | Date | Employee signature time | Yes | 2025-02-12 |
| employerSignedAt | Date | Employer signature time | Yes | 2025-02-12 |
| employeeSignatureUrl | string | Employee signature URL | No | Not found in seed files |
| employerSignatureUrl | string | Employer signature URL | No | Not found in seed files |

### Document

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| ownerId | ObjectId | Owner ref | Yes | employees.bob._id (resume); employees.alice._id (contract) |
| type | enum(DocumentType) | Document type | Yes | CV; CONTRACT |
| filePath | string | File path | Yes | /docs/candidates/john-doe-cv.pdf; /docs/contracts/john-doe-2025.pdf |
| uploadedAt | Date | Upload time | Yes | 2025-01-05; 2025-02-12 |

### Interview

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| applicationId | ObjectId | Application ref | Yes | application._id |
| stage | enum(ApplicationStage) | Interview stage | Yes | HR_INTERVIEW |
| scheduledDate | Date | Scheduled date/time | Yes | 2025-02-10T10:00:00Z |
| method | enum(InterviewMethod) | Interview method | Yes | VIDEO |
| panel | ObjectId[] | Interview panel | Yes | [employees.alice._id] |
| videoLink | string | Video link | Yes | <https://meet.example.com/interview-001> |
| status | enum(InterviewStatus) | Status | Yes | COMPLETED |
| feedbackId | ObjectId | Feedback ref | Yes | assessment._id |
| calendarEventId | string | Calendar event id | No | Not found in seed files |
| candidateFeedback | string | Candidate feedback | No | Not found in seed files |

### Offer

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| applicationId | ObjectId | Application ref | Yes | application._id |
| candidateId | ObjectId | Candidate ref | Yes | candidateJohn._id |
| hrEmployeeId | ObjectId | HR ref | Yes | employees.alice._id |
| grossSalary | number | Gross salary | Yes | 18000 |
| signingBonus | number | Signing bonus | Yes | 3000 |
| benefits | string[] | Benefits | Yes | ['Medical', 'Stock Options'] |
| role | string | Role | Yes | Software Engineer |
| deadline | Date | Offer deadline | Yes | 2025-02-20 |
| applicantResponse | enum(OfferResponseStatus) | Candidate response | Yes | ACCEPTED |
| approvers | array | Approver actions | Yes | [{ employeeId: employees.alice._id, role: HR Manager, status: APPROVED, actionDate: 2025-02-11 }] |
| finalStatus | enum(OfferFinalStatus) | Final status | Yes | APPROVED |
| candidateSignedAt | Date | Candidate signed | Yes | 2025-02-12 |
| hrSignedAt | Date | HR signed | Yes | 2025-02-12 |
| conditions | string | Conditions | No | Not found in seed files |
| insurances | string | Insurance details | No | Not found in seed files |
| content | string | Offer content | No | Not found in seed files |
| managerSignedAt | Date | Manager signed | No | Not found in seed files |

### Onboarding

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| contractId | ObjectId | Contract ref | Yes | contract._id |
| tasks | array | Onboarding tasks | Yes | Submit documents (COMPLETED, deadline 2025-02-20, completedAt 2025-02-15, documentId: resumeDoc._id); IT setup (IN_PROGRESS, deadline 2025-02-25) |
| completed | boolean | Completion flag | Yes | false |
| completedAt | Date | Completed at | No | Not found in seed files |

### Referral

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| referringEmployeeId | ObjectId | Referrer | Yes | employees.bob._id |
| candidateId | ObjectId | Candidate ref | Yes | candidateJohn._id |
| role | string | Referred role | Yes | Software Engineer |
| level | string | Level | Yes | Mid-level |

### TerminationRequest

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.charlie._id |
| initiator | enum(TerminationInitiation) | Initiator | Yes | HR |
| reason | string | Reason | Yes | Performance issues |
| hrComments | string | HR comments | Yes | Eligible for partial benefits |
| status | enum(TerminationStatus) | Status | Yes | UNDER_REVIEW |
| terminationDate | Date | Termination date | Yes | 2025-03-15 |
| contractId | ObjectId | Contract ref | Yes | contract._id |
| employeeComments | string | Employee comments | No | Not found in seed files |

## Fields Without Seed Values

- Candidate: middleName, gender, maritalStatus, dateOfBirth, homePhone, address, profilePictureUrl, accessProfileId.
- JobRequisition: expiryDate.
- Application: assignedHr.
- ClearanceChecklist: equipmentList.equipmentId, items.comments (optional).
- Contract: employeeSignatureUrl, employerSignatureUrl.
- Interview: calendarEventId, candidateFeedback.
- Offer: conditions, insurances, content, managerSignedAt.
- Onboarding: completedAt.
- TerminationRequest: employeeComments.

## Seeding Summary

- Total models: 14
- Total seeded fields: 90
- Total non-seeded fields: 20
- Notes/assumptions: Candidate seed uses only core identity fields and resume URL; several optional fields rely on runtime capture.
