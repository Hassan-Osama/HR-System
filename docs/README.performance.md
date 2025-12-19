# Performance Subsystem

## Models

### AppraisalCycle

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Cycle name | Yes | 2025 Annual Review Cycle |
| description | string | Description | Yes | Performance review for the year 2025 |
| cycleType | enum(AppraisalTemplateType) | Cycle type | Yes | ANNUAL |
| startDate | Date | Start date | Yes | 2025-01-01 |
| endDate | Date | End date | Yes | 2025-12-31 |
| templateAssignments | array | Template assignments | Yes | [{ templateId: template._id, departmentIds: [hrDept, engDept, salesDept] }] |
| status | enum(AppraisalCycleStatus) | Cycle status | Yes | PLANNED |
| managerDueDate | Date | Manager due date | No | Not found in seed files |
| employeeAcknowledgementDueDate | Date | Employee ack due | No | Not found in seed files |
| publishedAt | Date | Publish time | No | Not found in seed files |
| closedAt | Date | Close time | No | Not found in seed files |
| archivedAt | Date | Archive time | No | Not found in seed files |

### AppraisalTemplate

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Template name | Yes | Annual Review Template 2025 |
| description | string | Description | Yes | Standard annual review template |
| templateType | enum(AppraisalTemplateType) | Template type | Yes | ANNUAL |
| ratingScale | RatingScaleDefinition | Rating scale | Yes | type: FIVE_POINT; min:1; max:5; step:1; labels: [Poor, Fair, Good, Very Good, Excellent] |
| criteria | EvaluationCriterion[] | Criteria list | Yes | integrity (weight 30, required); teamwork (30, required); goal_achievement (40, required) |
| instructions | string | Instructions | Yes | Complete each criterion with ratings and narrative comments. |
| isActive | boolean | Active flag | Yes | true |
| applicableDepartmentIds | ObjectId[] | Applicable departments | No | Not found in seed files |
| applicablePositionIds | ObjectId[] | Applicable positions | No | Not found in seed files |

### AppraisalAssignment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| cycleId | ObjectId | Cycle ref | Yes | cycle._id |
| templateId | ObjectId | Template ref | Yes | template._id |
| employeeProfileId | ObjectId | Employee ref | Yes | employees.bob._id |
| managerProfileId | ObjectId | Manager ref | Yes | employees.alice._id |
| departmentId | ObjectId | Department ref | Yes | departments.engDept._id |
| positionId | ObjectId | Position ref | Yes | positions.softwareEngPos._id |
| status | enum(AppraisalAssignmentStatus) | Assignment status | Yes | IN_PROGRESS (initial), later PUBLISHED after update |
| assignedAt | Date | Assigned date | Yes | 2025-01-15 |
| dueDate | Date | Due date | Yes | 2025-02-28 |
| submittedAt | Date | Submission time | No | Not found in seed files |
| publishedAt | Date | Publish time | No | Not found in seed files |
| latestAppraisalId | ObjectId | Latest appraisal record | No | Not found in initial seed (set in update after record creation) |

### AppraisalRecord

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| assignmentId | ObjectId | Assignment ref | Yes | assignment._id |
| cycleId | ObjectId | Cycle ref | Yes | cycle._id |
| templateId | ObjectId | Template ref | Yes | template._id |
| employeeProfileId | ObjectId | Employee ref | Yes | employees.bob._id |
| managerProfileId | ObjectId | Manager ref | Yes | employees.alice._id |
| ratings | RatingEntry[] | Ratings list | Yes | integrity:4 (Very Good, weighted 1.2); teamwork:5 (Excellent, weighted 1.5); goal_achievement:4 (Very Good, weighted 1.6) |
| totalScore | number | Total score | Yes | 4.3 |
| overallRatingLabel | string | Overall rating | Yes | Exceeds Expectations |
| managerSummary | string | Manager summary | Yes | Consistently delivers high-quality work. |
| strengths | string | Strengths | Yes | Ownership, mentoring junior devs |
| improvementAreas | string | Improvement areas | Yes | Document more design decisions |
| status | enum(AppraisalRecordStatus) | Record status | Yes | HR_PUBLISHED |
| managerSubmittedAt | Date | Manager submit time | Yes | 2025-03-01 |
| hrPublishedAt | Date | HR publish time | Yes | 2025-03-05 |
| publishedByEmployeeId | ObjectId | Publisher | Yes | employees.alice._id |
| employeeViewedAt | Date | Employee viewed | Yes | 2025-03-06 |
| employeeAcknowledgedAt | Date | Employee acknowledged | Yes | 2025-03-07 |
| employeeAcknowledgementComment | string | Employee comment | No | Not found in seed files |
| archivedAt | Date | Archive time | No | Not found in seed files |

### AppraisalDispute

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| _id | ObjectId | Dispute id | Yes | Generated ObjectId |
| appraisalId | ObjectId | Appraisal ref | Yes | record._id |
| assignmentId | ObjectId | Assignment ref | Yes | assignment._id |
| cycleId | ObjectId | Cycle ref | Yes | cycle._id |
| raisedByEmployeeId | ObjectId | Raised by | Yes | employees.bob._id |
| reason | string | Reason | Yes | Clarify weighting for goal achievement |
| details | string | Details | Yes | Requesting review of weight distribution. |
| status | enum(AppraisalDisputeStatus) | Status | Yes | OPEN |
| assignedReviewerEmployeeId | ObjectId | Reviewer | Yes | employees.alice._id |
| submittedAt | Date | Submission time | No | Not found in seed files (uses default) |
| resolutionSummary | string | Resolution summary | No | Not found in seed files |
| resolvedAt | Date | Resolution time | No | Not found in seed files |
| resolvedByEmployeeId | ObjectId | Resolver | No | Not found in seed files |

## Fields Without Seed Values

- AppraisalCycle: managerDueDate, employeeAcknowledgementDueDate, publishedAt, closedAt, archivedAt.
- AppraisalTemplate: applicableDepartmentIds, applicablePositionIds.
- AppraisalAssignment: submittedAt, publishedAt, latestAppraisalId (set later by update but not initially seeded).
- AppraisalRecord: employeeAcknowledgementComment, archivedAt.
- AppraisalDispute: submittedAt, resolutionSummary, resolvedAt, resolvedByEmployeeId.

## Seeding Summary

- Total models: 5
- Total seeded fields: 50
- Total non-seeded fields: 16
- Notes/assumptions: ObjectIds generated during inserts; assignment.latestAppraisalId is set via update after record creation, not part of initial create payload.
