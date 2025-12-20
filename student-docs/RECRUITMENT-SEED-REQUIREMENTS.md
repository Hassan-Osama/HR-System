# Recruitment Seed Requirements

## 1) Subsystem Overview
Seeds job templates, requisitions, candidates, applications, interviews, assessments, referrals, documents, offers, contracts, onboarding, termination request, and clearance checklist.

## 2) Collections / Models Seeded
- JobTemplate
- JobRequisition
- Candidate
- Application
- ApplicationStatusHistory
- Interview
- AssessmentResult
- Referral
- Document
- Offer
- Contract
- Onboarding
- TerminationRequest
- ClearanceChecklist

## 3) REQUIRED Records (The Evaluation Checklist)

### JobTemplate
| title | department | qualifications | skills | description |
| --- | --- | --- | --- | --- |
| Software Engineer | Engineering | ["BS in Computer Science"] | ["Node.js","TypeScript","MongoDB"] | Develop and maintain software applications. |
| HR Manager | Human Resources | ["BA in Human Resources"] | ["Communication","Labor Law"] | Manage HR operations. |

### JobRequisition
| requisitionId | templateId | openings | location | hiringManagerId | publishStatus | postingDate |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | Software Engineer template | 2 | Cairo | alice@company.com | published | date(now) |

### Candidate
| candidateNumber | fullName | nationalId | personalEmail | mobilePhone | departmentId | positionId | status | applicationDate | resumeUrl | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAND-001 | John Doe | NAT-JOHN-001 | john.doe@example.com | 1234567890 | ENG-001 | POS-SWE | SCREENING | — | http://example.com/resume.pdf | Referred by Bob for SWE role. |
| CAND-002 | Sara Kim | NAT-SARA-002 | sara.kim@example.com | 9876543210 | HR-001 | POS-HR-MGR | APPLIED | — | http://example.com/resume-sara-kim.pdf | HR generalist with policy experience. |
| CAND-003 | Omar Nasser | NAT-OMAR-003 | omar.nasser@example.com | 5554443333 | SALES-001 | POS-SALES-REP | INTERVIEW | 2025-01-10 | http://example.com/resume-omar-nasser.pdf | SaaS sales background; pipeline-focused. |

### Application
| candidateId | requisitionId | currentStage | status |
| --- | --- | --- | --- |
| John Doe | REQ-001 | SCREENING | SUBMITTED |

### ApplicationStatusHistory
| applicationId | oldStage | newStage | oldStatus | newStatus | changedBy |
| --- | --- | --- | --- | --- | --- |
| John Doe application | SCREENING | HR_INTERVIEW | SUBMITTED | IN_PROCESS | alice@company.com |

### Interview
| applicationId | stage | scheduledDate | method | panel | videoLink | status |
| --- | --- | --- | --- | --- | --- | --- |
| John Doe application | HR_INTERVIEW | 2025-02-10T10:00:00Z | VIDEO | [alice@company.com] | https://meet.example.com/interview-001 | COMPLETED |

### AssessmentResult
| interviewId | interviewerId | score | comments |
| --- | --- | --- | --- |
| (above interview) | alice@company.com | 4.5 | Strong technical depth and communication. |

### Referral
| referringEmployeeId | candidateId | role | level |
| --- | --- | --- | --- |
| bob@company.com | John Doe | Software Engineer | Mid-level |

### Document
| ownerId | type | filePath | uploadedAt |
| --- | --- | --- | --- |
| bob@company.com | CV | /docs/candidates/john-doe-cv.pdf | 2025-01-05 |
| alice@company.com | CONTRACT | /docs/contracts/john-doe-2025.pdf | 2025-02-12 |

### Offer
| applicationId | candidateId | hrEmployeeId | grossSalary | signingBonus | benefits | role | deadline | applicantResponse | approvers | finalStatus | candidateSignedAt | hrSignedAt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| John Doe application | John Doe | alice@company.com | 18000 | 3000 | ["Medical","Stock Options"] | Software Engineer | 2025-02-20 | ACCEPTED | [{employeeId: alice, role: HR Manager, status: APPROVED, actionDate: 2025-02-11}] | APPROVED | 2025-02-12 | 2025-02-12 |

### Contract
| offerId | acceptanceDate | grossSalary | signingBonus | role | benefits | documentId | employeeSignedAt | employerSignedAt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Offer above | 2025-02-12 | 18000 | 3000 | Software Engineer | ["Medical","Stock Options"] | contract document | 2025-02-12 | 2025-02-12 |

### Onboarding
| employeeId | contractId | tasks |
| --- | --- | --- |
| bob@company.com | contract above | Submit documents (HR, COMPLETED, deadline 2025-02-20, completedAt 2025-02-15, documentId resumeDoc); IT setup (IT, IN_PROGRESS, deadline 2025-02-25) |

### TerminationRequest
| employeeId | initiator | reason | hrComments | status | terminationDate | contractId |
| --- | --- | --- | --- | --- | --- | --- |
| charlie@company.com | HR | Performance issues | Eligible for partial benefits | UNDER_REVIEW | 2025-03-15 | contract above |

### ClearanceChecklist
| terminationId | items | equipmentList | cardReturned |
| --- | --- | --- | --- |
| termination request above | [{department: IT, status: PENDING}, {department: Finance, status: APPROVED, updatedBy alice, updatedAt 2025-03-10}] | [{name: Laptop, returned: true, condition: Good}] | false |

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Some optional fields (e.g., candidate passwords hashed, assessment comments beyond provided) remain default/undefined.

## 5) Enums & Status Coverage
- CandidateStatus: SCREENING, APPLIED, INTERVIEW used.
- ApplicationStage: SCREENING, HR_INTERVIEW used.
- ApplicationStatus: SUBMITTED, IN_PROCESS used.
- DocumentType: CV, CONTRACT used.
- InterviewMethod: VIDEO; InterviewStatus: COMPLETED used.
- OfferResponseStatus: ACCEPTED; OfferFinalStatus: APPROVED; ApprovalStatus: APPROVED/PENDING used.
- OnboardingTaskStatus: COMPLETED, IN_PROGRESS used.
- TerminationInitiation: HR; TerminationStatus: UNDER_REVIEW used.

## 6) Validation Notes
- References to employees (alice, bob, charlie) and departments/positions must match seeds from other subsystems.
- Requisition references job template; application references requisition and candidate; interview/assessment reference application; offer references application/candidate/HR employee; contract references offer/document; onboarding references employee/contract; termination references employee/contract; clearance checklist references termination.

## 7) Minimum Acceptance Checklist
- Two job templates exist with exact titles/qualifications/skills.
- Requisition REQ-001 published with two openings and hiringManager alice.
- Three candidates with specified identifiers, departments, positions, statuses, and resume URLs exist.
- Application and history record for John Doe exist with correct stages/status changes.
- Interview, assessment, referral, documents, offer, and contract exist exactly as described.
- Onboarding record for Bob created with two tasks and completion metadata.
- TerminationRequest for Charlie exists referencing contract with status UNDER_REVIEW and matching dates.
- ClearanceChecklist exists with two items (IT pending, Finance approved) and laptop equipment entry, cardReturned false.
