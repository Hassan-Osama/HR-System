# Performance Seed Requirements

## 1) Subsystem Overview
Seeds appraisal templates, cycles, assignments, appraisal records, and disputes; updates employee profiles with latest appraisal references.

## 2) Collections / Models Seeded
- AppraisalTemplate
- AppraisalCycle
- AppraisalAssignment
- AppraisalRecord
- AppraisalDispute
- EmployeeProfile (last appraisal reference fields updated)

## 3) REQUIRED Records (The Evaluation Checklist)

### AppraisalTemplate
| Name | Type | Active | Rating Scale | Criteria (key:title:weight:required) |
| --- | --- | --- | --- | --- |
| Annual Review Template 2025 | ANNUAL | true | FIVE_POINT 1-5 step1 labels Poor/Fair/Good/Very Good/Excellent | integrity:Integrity:30:true; teamwork:Teamwork:30:true; goal_achievement:Goal Achievement:40:true |
| Semi-Annual Review Template 2025 | SEMI_ANNUAL | true | THREE_POINT 1-3 labels Below Expectations/Meets/Exceeds | collaboration:Collaboration:50:true; delivery:Delivery:50:true |
| Probationary Review Template | PROBATIONARY | true | TEN_POINT 1-10 | learning_curve:Learning Curve:50:true; culture_fit:Culture Fit:50:true |
| Project Review Template | PROJECT | true | FIVE_POINT 1-5 | delivery_quality:Delivery Quality:60:true; stakeholder_mgmt:Stakeholder Management:40:true |
| Ad Hoc Review Template | AD_HOC | true | THREE_POINT 1-3 | responsiveness:Responsiveness:50:true; ownership:Ownership:50:true |

### AppraisalCycle
| Name | Type | Status | Dates | Template Assignments |
| --- | --- | --- | --- | --- |
| 2025 Annual Review Cycle | ANNUAL | PLANNED | 2025-01-01 to 2025-12-31 | Annual template for HR-001, ENG-001, SALES-001 |
| 2025 Midyear Cycle | SEMI_ANNUAL | ACTIVE | 2025-06-01 to 2025-06-30 (publishedAt 2025-06-01) | Semi-Annual template for ENG-001 |
| 2024 Probationary Cycle | PROBATIONARY | CLOSED (closedAt 2024-05-15) | 2024-02-01 to 2024-04-30 | Probationary template for HR-001 |
| 2023 Project Cycle | PROJECT | ARCHIVED (archivedAt 2024-01-10) | 2023-03-01 to 2023-05-31 | Project template for SALES-001 |

### AppraisalAssignment (with statuses)
| Employee | Manager | Cycle | Template | Dept | Position | Status | Dates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| bob@company.com | alice@company.com | 2025 Annual | Annual | ENG-001 | POS-SWE | IN_PROGRESS → later PUBLISHED | assigned 2025-01-15; due 2025-02-28 |
| charlie@company.com | alice@company.com | 2025 Annual | Annual | SALES-001 | POS-SALES-REP | IN_PROGRESS → later PUBLISHED | assigned 2025-01-16; due 2025-02-28 |
| alice@company.com | bob@company.com | 2025 Annual | Annual | HR-001 | POS-HR-MGR | IN_PROGRESS → later PUBLISHED | assigned 2025-01-17; due 2025-02-28 |
| bob@company.com | alice@company.com | 2025 Midyear | Semi-Annual | ENG-001 | POS-SWE | NOT_STARTED | assigned 2025-06-02; due 2025-06-30 |
| alice@company.com | bob@company.com | 2024 Probationary | Probationary | HR-001 | POS-HR-MGR | SUBMITTED | assigned 2024-02-05; due 2024-04-15; submittedAt 2024-04-10 |
| charlie@company.com | alice@company.com | 2023 Project | Project | SALES-001 | POS-SALES-REP | ACKNOWLEDGED | assigned 2023-03-05; due 2023-05-15; submittedAt 2023-05-10; publishedAt 2023-05-20 |

### AppraisalRecord
| Employee | Assignment | Cycle | Template | Status | Ratings summary |
| --- | --- | --- | --- | --- | --- |
| bob@company.com | annual assignment | 2025 Annual | Annual | HR_PUBLISHED | ratings: integrity 4 Very Good (1.2), teamwork 5 Excellent (1.5), goal_achievement 4 Very Good (1.6); totalScore 4.3; overall Exceeds Expectations; managerSummary "Consistently delivers high-quality work."; strengths Ownership/mentoring; improvement Document more design decisions; managerSubmittedAt 2025-03-01; hrPublishedAt 2025-03-05; publishedBy alice; employeeViewed 2025-03-06; acknowledged 2025-03-07 |
| charlie@company.com | annual assignment | 2025 Annual | Annual | HR_PUBLISHED | integrity 3 Good (0.9); teamwork 4 Very Good (1.2); goal_achievement 3 Good (1.2); totalScore 3.3; overall Meets Expectations; managerSummary "Solid contributor; focus on pipeline consistency."; strengths Client rapport; improvement forecasting; managerSubmittedAt 2025-03-02; hrPublishedAt 2025-03-06; publishedBy alice; viewed 2025-03-07; acknowledged 2025-03-08 |
| alice@company.com | annual assignment | 2025 Annual | Annual | HR_PUBLISHED | integrity 5 Excellent (1.5); teamwork 5 Excellent (1.5); goal_achievement 5 Excellent (2); totalScore 5; overall Outstanding; managerSummary "Sets the bar for leadership and delivery."; improvement Delegate more; managerSubmittedAt 2025-03-03; hrPublishedAt 2025-03-07; publishedBy bob; viewed 2025-03-08; acknowledged 2025-03-09 |
| bob@company.com | 2025 Midyear assignment | 2025 Midyear | Semi-Annual | DRAFT | ratings [] |
| alice@company.com | 2024 Probationary | 2024 Probationary | Probationary | MANAGER_SUBMITTED | ratings: learning_curve ratingValue 8 ratingLabel Strong; managerSubmittedAt 2024-04-10 |
| charlie@company.com | 2023 Project | 2023 Project | Project | ARCHIVED | ratings: delivery_quality 4 Very Good; archivedAt 2024-01-10 |

### AppraisalDispute
| Appraisal (employee) | Reason | Status | Reviewer |
| --- | --- | --- | --- |
| bob@company.com annual record | Clarify weighting for goal achievement | OPEN | assignedReviewer alice |
| alice@company.com probationary record | Score clarification | UNDER_REVIEW | assignedReviewer bob |
| charlie@company.com project record | Archived decision dispute | ADJUSTED | resolvedAt 2024-02-01; resolvedBy alice; resolutionSummary "Adjusted rating after review" |
| charlie@company.com annual record | Disagree with teamwork score | REJECTED | resolvedAt 2025-03-10; resolvedBy alice |

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Many optional narrative fields (comments, attachments) are unset where not specified.

## 5) Enums & Status Coverage
- AppraisalTemplateType: ANNUAL, SEMI_ANNUAL, PROBATIONARY, PROJECT, AD_HOC represented.
- AppraisalRatingScaleType: FIVE_POINT, THREE_POINT, TEN_POINT used.
- AppraisalCycleStatus: PLANNED, ACTIVE, CLOSED, ARCHIVED used.
- AppraisalAssignmentStatus: IN_PROGRESS, NOT_STARTED, SUBMITTED, ACKNOWLEDGED, PUBLISHED used.
- AppraisalRecordStatus: HR_PUBLISHED, DRAFT, MANAGER_SUBMITTED, ARCHIVED used.
- AppraisalDisputeStatus: OPEN, UNDER_REVIEW, ADJUSTED, REJECTED used.

## 6) Validation Notes
- Employees, departments, and positions must exist from Organization Structure and Employee Profile seeds.
- Assignments reference cycles, templates, employees, positions, and departments; ensure referential integrity.
- Records link to assignments and cycles; disputes link to records and assignments.
- EmployeeProfile fields `lastAppraisal*` are updated from records—students should mirror these references to match seeded records.

## 7) Minimum Acceptance Checklist
- All five templates exist with exact names, types, rating scales, and criteria.
- Four cycles exist with correct date ranges, statuses, and templateAssignments.
- Six assignments seeded with the exact employee/manager/department/position/status/dates shown.
- Six appraisal records seeded with the listed ratings, totals, statuses, and timestamps.
- Four appraisal disputes seeded with reasons and statuses as specified.
- EmployeeProfile last appraisal references updated accordingly.
