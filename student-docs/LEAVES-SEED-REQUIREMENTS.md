# Leaves Seed Requirements

## 1) Subsystem Overview
Seeds leave categories, types, policies, entitlements, requests (with approvals), attachments, calendar, and leave adjustments.

## 2) Collections / Models Seeded
- LeaveCategory
- LeaveType
- LeavePolicy
- LeaveEntitlement
- LeaveRequest
- Attachment
- Calendar
- LeaveAdjustment
- Holiday (referenced from Time Management)

## 3) REQUIRED Records (The Evaluation Checklist)

### LeaveCategory
| name | description |
| --- | --- |
| Annual | Standard annual leave |
| Sick | Medical leave |
| Unpaid | Unpaid leave category |

### LeaveType
| code | name | category | description | paid | deductible | requiresAttachment | attachmentType |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AL | Annual Leave | Annual | Paid annual leave | true | true | false | — |
| SL | Sick Leave | Sick | Paid sick leave | true | true | true | MEDICAL |
| UL | Unpaid Leave | Unpaid | Unpaid leave type | false | false | false | — |

### LeavePolicy
| leaveType | accrualMethod | monthlyRate | yearlyRate | carryForwardAllowed | maxCarryForward | roundingRule | minNoticeDays | eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AL | MONTHLY | 1.75 | 21 | true | 5 | ROUND_UP | 7 | minTenureMonths 6 |
| SL | YEARLY | — | 14 | false | — | NONE | 0 | none |

### LeaveEntitlement
| employee | leaveType | yearlyEntitlement | accruedActual | accruedRounded | remaining |
| --- | --- | --- | --- | --- | --- |
| alice@company.com | AL | 21 | 21 | 21 | 21 |
| alice@company.com | SL | 14 | 14 | 14 | 14 |
| bob@company.com | SL | 14 | 14 | 14 | 14 |
| tariq.ta@company.com | AL | 21 | 21 | 21 | 21 |
| tariq.ta@company.com | SL | 14 | 14 | 14 | 14 |
| laila.la@company.com | AL | 21 | 21 | 21 | 21 |
| laila.la@company.com | SL | 14 | 14 | 14 | 14 |
| amir.accountant@company.com | AL | 21 | 21 | 21 | 21 |
| amir.accountant@company.com | SL | 14 | 14 | 14 | 14 |
| salma.librarian@company.com | UL | 0 | 0 | 0 | 0 |

### LeaveRequest (with approvals)
| employee | leaveType | dates (from-to) | durationDays | justification | status | approvalFlow |
| --- | --- | --- | --- | --- | --- | --- |
| alice@company.com | AL | nextWeek to nextWeek+2 (3 days) | 3 | Vacation | PENDING | Manager: Pending |
| bob@company.com | SL | today to nextWeek (7 days) | 7 | Medical leave | APPROVED | HR: Approved by alice at now |
| tariq.ta@company.com | AL | 2025-05-01 to 2025-05-02 | 2 | Workshop support travel | REJECTED | Manager Rejected by alice at 2025-04-20 |
| tariq.ta@company.com | AL | 2025-06-10 to 2025-06-10 | 1 | Training conflict | REJECTED | Manager Rejected by alice at 2025-06-05 |
| tariq.ta@company.com | SL | 2025-07-15 to 2025-07-16 | 2 | Medical checkup | REJECTED | HR Rejected by bob at 2025-07-10 |
| tariq.ta@company.com | AL | 2025-08-20 to 2025-08-22 | 3 | Family event | REJECTED | Manager Rejected by alice at 2025-08-15 |
| tariq.ta@company.com | AL | 2025-09-05 to 2025-09-06 | 2 | Professional certification prep | APPROVED | Manager Approved by alice at 2025-08-30 |
| laila.la@company.com | AL | 2025-05-12 to 2025-05-13 | 2 | Conference attendance | APPROVED | Manager Approved by alice at 2025-05-05 |
| laila.la@company.com | AL | 2025-06-18 to 2025-06-19 | 2 | Family visit | APPROVED | Manager Approved by alice at 2025-06-10 |
| laila.la@company.com | SL | 2025-07-08 to 2025-07-09 | 2 | Dental procedure recovery | APPROVED | HR Approved by bob at 2025-07-05 |
| amir.accountant@company.com | AL | 2025-05-22 to 2025-05-23 | 2 | Quarter-end break | PENDING | Manager Pending |
| amir.accountant@company.com | SL | 2025-06-02 to 2025-06-02 | 1 | Clinic visit | PENDING | HR Pending |
| amir.accountant@company.com | AL | 2025-07-20 to 2025-07-22 | 3 | Family vacation | APPROVED | Manager Approved by alice at 2025-07-10 |
| amir.accountant@company.com | AL | 2025-08-12 to 2025-08-13 | 2 | Audit support conflict | REJECTED | Manager Rejected by alice at 2025-08-05 |
| salma.librarian@company.com | UL | 2025-09-15 to 2025-09-17 | 3 | Community event support (unpaid) | APPROVED | Manager Approved by alice at 2025-09-05 |

### Attachment
| originalName | filePath | fileType | size |
| --- | --- | --- | --- |
| medical-report.pdf | /attachments/medical-report.pdf | application/pdf | 350000 |

### Calendar
| year | holidays | blockedPeriods |
| --- | --- | --- |
| current year | holidays referenced from Holiday collection (from Time Management) | one blocked period 2025-08-01 to 2025-08-15 reason "Peak season blackout" |

### LeaveAdjustment
| employee | leaveType | adjustmentType | amount | reason | hrUserId |
| --- | --- | --- | --- | --- | --- |
| charlie@company.com | AL | ADD | 2 | Recognition award | alice@company.com |

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Some approval metadata and calendar fields remain default if not specified.
- For the first Alice leave request, dates are computed relative to seeding (next week); store exact values consistent with seeding time.

## 5) Enums & Status Coverage
- AttachmentType: MEDICAL used.
- AccrualMethod: MONTHLY, YEARLY used.
- RoundingRule: ROUND_UP, NONE used.
- LeaveStatus: PENDING, APPROVED, REJECTED used.
- AdjustmentType: ADD used.

## 6) Validation Notes
- Employees must exist; leaveType/category references must match seeded documents.
- Approval flows embed employee references where specified (alice/bob) and statuses must match.
- Holidays come from Time Management seed; calendar pulls current-year holidays.

## 7) Minimum Acceptance Checklist
- Three leave categories/types exist with exact codes and flags.
- Two policies seeded with the stated accrual/eligibility values.
- Entitlements for Alice for AL and SL exist with full accrual/remaining values.
- Fifteen leave requests exist with statuses/approvals as listed.
- Attachment medical-report.pdf exists and is linked to Bob’s sick leave request.
- Calendar document for current year exists with blackout period and holiday references.
- LeaveAdjustment for Charlie exists (ADD 2 days).
