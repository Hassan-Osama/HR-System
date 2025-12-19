# Performance Subsystem

## Seed Files

- src/seeds/performance.seed.ts (entry point for Performance data)

## Models

### AppraisalTemplate

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Template name | ✅ | Annual Review Template 2025; Semi-Annual Review Template 2025; Probationary Review Template; Project Review Template; Ad Hoc Review Template |
| description | string | Description | ✅ | Provided for all templates as in seed data |
| templateType | enum(AppraisalTemplateType) | Template type | ✅ | ANNUAL; SEMI_ANNUAL; PROBATIONARY; PROJECT; AD_HOC |
| ratingScale | RatingScaleDefinition | Rating scale | ✅ | FIVE_POINT (annual, project: min 1 max 5 step 1 labels Poor→Excellent); THREE_POINT (semi-annual, ad hoc: min 1 max 3 step 1 labels Below→Exceeds); TEN_POINT (probationary: min 1 max 10 step 1 labels 1–10) |
| criteria | EvaluationCriterion[] | Criteria list | ✅ | Annual: integrity/teamwork/goal_achievement (30/30/40, required). Semi-annual: collaboration/delivery (50/50). Probationary: learning_curve/culture_fit (50/50). Project: delivery_quality/stakeholder_mgmt (60/40). Ad hoc: responsiveness/ownership (50/50). |
| instructions | string | Instructions | ✅ | Present for annual template only |
| isActive | boolean | Active flag | ✅ | true for all templates |
| applicableDepartmentIds | ObjectId[] | Applicable departments | ❌ | Not present in seed data |
| applicablePositionIds | ObjectId[] | Applicable positions | ❌ | Not present in seed data |

### AppraisalCycle

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Cycle name | ✅ | 2025 Annual Review Cycle; 2025 Midyear Cycle; 2024 Probationary Cycle; 2023 Project Cycle |
| description | string | Description | ✅ | As per cycle names (annual/midyear/probationary/project) |
| cycleType | enum(AppraisalTemplateType) | Cycle type | ✅ | ANNUAL; SEMI_ANNUAL; PROBATIONARY; PROJECT |
| startDate | Date | Start date | ✅ | 2025-01-01; 2025-06-01; 2024-02-01; 2023-03-01 |
| endDate | Date | End date | ✅ | 2025-12-31; 2025-06-30; 2024-04-30; 2023-05-31 |
| managerDueDate | Date | Manager due date | ❌ | Not present in seed data |
| employeeAcknowledgementDueDate | Date | Employee ack due | ❌ | Not present in seed data |
| templateAssignments | array | Template assignments | ✅ | Annual: annualTemplate + HR/ENG/SALES depts. Midyear: semiAnnualTemplate + ENG. Probationary: probationaryTemplate + HR. Project: projectTemplate + SALES. |
| status | enum(AppraisalCycleStatus) | Cycle status | ✅ | PLANNED (annual); ACTIVE (midyear with publishedAt 2025-06-01); CLOSED (probationary with closedAt 2024-05-15); ARCHIVED (project with archivedAt 2024-01-10) |
| publishedAt | Date | Publish time | ✅ | 2025-06-01 for midyear cycle |
| closedAt | Date | Close time | ✅ | 2024-05-15 for probationary cycle |
| archivedAt | Date | Archive time | ✅ | 2024-01-10 for project cycle |

### AppraisalAssignment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| cycleId | ObjectId | Cycle ref | ✅ | References annual/midyear/probationary/project cycles as created |
| templateId | ObjectId | Template ref | ✅ | References matching templates |
| employeeProfileId | ObjectId | Employee ref | ✅ | alice, bob, charlie as per entries |
| managerProfileId | ObjectId | Manager ref | ✅ | alice or bob as per entries |
| departmentId | ObjectId | Department ref | ✅ | HR/ENG/SALES |
| positionId | ObjectId | Position ref | ✅ | hrManagerPos, softwareEngPos, salesRepPos |
| status | enum(AppraisalAssignmentStatus) | Assignment status | ✅ | IN_PROGRESS (3 annual); NOT_STARTED (midyear/bob); SUBMITTED (probationary/alice); ACKNOWLEDGED (project/charlie); annual assignments updated to PUBLISHED after record linkage |
| assignedAt | Date | Assigned date | ✅ | Provided for all entries |
| dueDate | Date | Due date | ✅ | Provided for all entries |
| submittedAt | Date | Submission time | ✅ | Provided for probationary and project assignments |
| publishedAt | Date | Publish time | ✅ | Provided for project assignment (2023-05-20) |
| latestAppraisalId | ObjectId | Latest appraisal record | ✅ | Set for annual assignments during post-create update; not set for additional assignments |

### AppraisalRecord

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| assignmentId | ObjectId | Assignment ref | ✅ | Links to base and additional assignments |
| cycleId | ObjectId | Cycle ref | ✅ | Annual, midyear, probationary, project |
| templateId | ObjectId | Template ref | ✅ | Annual, semi-annual, probationary, project |
| employeeProfileId | ObjectId | Employee ref | ✅ | bob, charlie, alice (varies) |
| managerProfileId | ObjectId | Manager ref | ✅ | alice or bob |
| ratings | RatingEntry[] | Ratings list | ✅ | Annual records have full ratings; midyear record empty; probationary record has learning_curve:8 (Strong); project record has delivery_quality:4 (Very Good) |
| totalScore | number | Total score | ✅ | Present for annual records (4.3, 3.3, 5); absent for others |
| overallRatingLabel | string | Overall rating | ✅ | Present for annual records (Exceeds/Meets/Outstanding); absent for others |
| managerSummary | string | Manager summary | ✅ | Present for annual records; absent for others |
| strengths | string | Strengths | ✅ | Present for annual records; absent for others |
| improvementAreas | string | Improvement areas | ✅ | Present for annual records; absent for others |
| status | enum(AppraisalRecordStatus) | Record status | ✅ | HR_PUBLISHED (annual records); DRAFT (midyear); MANAGER_SUBMITTED (probationary); ARCHIVED (project) |
| managerSubmittedAt | Date | Manager submit time | ✅ | Present for annual and probationary records |
| hrPublishedAt | Date | HR publish time | ✅ | Present for annual records |
| publishedByEmployeeId | ObjectId | Publisher | ✅ | Present for annual records |
| employeeViewedAt | Date | Employee viewed | ✅ | Present for annual records |
| employeeAcknowledgedAt | Date | Employee acknowledged | ✅ | Present for annual records |
| employeeAcknowledgementComment | string | Employee comment | ❌ | Not present in seed data |
| archivedAt | Date | Archive time | ✅ | Present for project record (2024-01-10) |

### AppraisalDispute

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| _id | ObjectId | Dispute id | ✅ | Generated per record |
| appraisalId | ObjectId | Appraisal ref | ✅ | References base and additional records |
| assignmentId | ObjectId | Assignment ref | ✅ | References related assignments |
| cycleId | ObjectId | Cycle ref | ✅ | Annual, closed, archived cycles covered |
| raisedByEmployeeId | ObjectId | Raised by | ✅ | bob, alice, charlie |
| reason | string | Reason | ✅ | Clarify weighting; Score clarification; Archived decision dispute; Disagree with teamwork score |
| details | string | Details | ✅ | Provided for first dispute only |
| status | enum(AppraisalDisputeStatus) | Status | ✅ | OPEN; UNDER_REVIEW; ADJUSTED; REJECTED |
| assignedReviewerEmployeeId | ObjectId | Reviewer | ✅ | Present for OPEN and UNDER_REVIEW disputes |
| submittedAt | Date | Submission time | ✅ | Defaults at creation (not explicitly set) |
| resolutionSummary | string | Resolution summary | ✅ | Provided for ADJUSTED dispute |
| resolvedAt | Date | Resolution time | ✅ | Provided for ADJUSTED (2024-02-01) and REJECTED (2025-03-10) disputes |
| resolvedByEmployeeId | ObjectId | Resolver | ✅ | Provided for ADJUSTED and REJECTED disputes |

## Fields Without Seed Values

- AppraisalTemplate: applicableDepartmentIds, applicablePositionIds.
- AppraisalCycle: managerDueDate, employeeAcknowledgementDueDate.
- AppraisalAssignment: latestAppraisalId is not set for additional (non-annual) assignments.
- AppraisalRecord: employeeAcknowledgementComment; totalScore/overallRatingLabel/managerSummary/strengths/improvementAreas are absent for midyear/probationary/project records by design.

## Seeding Summary

- Seed files: src/seeds/performance.seed.ts
- Models seeded: AppraisalTemplate, AppraisalCycle, AppraisalAssignment, AppraisalRecord, AppraisalDispute.
- Enum coverage: All performance-related enum values are represented in seeded records (see PERFORMANCE_ENUM_COVERAGE_REPORT.md).
