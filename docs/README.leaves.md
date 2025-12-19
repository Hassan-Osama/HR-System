# Leaves Subsystem

## Models

### LeaveCategory

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Category name | Yes | Annual; Sick |
| description | string | Category description | Yes | Standard annual leave; Medical leave |

### LeaveType

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| code | string | Type code | Yes | AL; SL |
| name | string | Type name | Yes | Annual Leave; Sick Leave |
| categoryId | ObjectId | Linked category | Yes | annualCategory._id; sickCategory._id |
| description | string | Details | Yes | Paid annual leave; Paid sick leave |
| paid | boolean | Paid flag | Yes | true |
| deductible | boolean | Counts against balance | Yes | true |
| requiresAttachment | boolean | Needs attachment | Yes | false (Annual); true (Sick) |
| attachmentType | enum(AttachmentType) | Required attachment type | Yes | MEDICAL (Sick) |
| minTenureMonths | number | Minimum tenure months | No | Not found in seed files |
| maxDurationDays | number | Max duration days | No | Not found in seed files |

### LeavePolicy

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| leaveTypeId | ObjectId | Leave type ref | Yes | annualLeave._id; sickLeave._id |
| accrualMethod | enum(AccrualMethod) | Accrual method | Yes | MONTHLY (Annual); YEARLY (Sick) |
| monthlyRate | number | Monthly accrual | Yes | 1.75 (Annual) |
| yearlyRate | number | Yearly accrual | Yes | 21 (Annual); 14 (Sick) |
| carryForwardAllowed | boolean | Carry forward allowed | Yes | true (Annual); false (Sick) |
| maxCarryForward | number | Max carry forward | Yes | 5 (Annual) |
| roundingRule | enum(RoundingRule) | Rounding rule | Yes | ROUND_UP (Annual); NONE (Sick) |
| minNoticeDays | number | Minimum notice | Yes | 7 (Annual); 0 (Sick) |
| eligibility | object | Eligibility rules | Yes | { minTenureMonths: 6 } (Annual); {} (Sick) |
| expiryAfterMonths | number | Expiry after months | No | Not found in seed files |
| maxConsecutiveDays | number | Max consecutive days | No | Not found in seed files |
| eligibility.positionsAllowed | string[] | Positions allowed | No | Not found in seed files |
| eligibility.contractTypesAllowed | string[] | Contract types allowed | No | Not found in seed files |

### LeaveEntitlement

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.alice._id (2 records) |
| leaveTypeId | ObjectId | Leave type ref | Yes | annualLeave._id; sickLeave._id |
| yearlyEntitlement | number | Annual entitlement | Yes | 21 (Annual); 14 (Sick) |
| accruedActual | number | Accrued raw | Yes | 21 (Annual); 14 (Sick) |
| accruedRounded | number | Accrued rounded | Yes | 21 (Annual); 14 (Sick) |
| remaining | number | Remaining balance | Yes | 21 (Annual); 14 (Sick) |
| carryForward | number | Carried forward | No | Not found in seed files |
| taken | number | Taken days | No | Not found in seed files |
| pending | number | Pending approval | No | Not found in seed files |
| lastAccrualDate | Date | Last accrual date | No | Not found in seed files |
| nextResetDate | Date | Next reset date | No | Not found in seed files |

### LeaveRequest

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Requesting employee | Yes | employees.alice._id; employees.bob._id |
| leaveTypeId | ObjectId | Leave type ref | Yes | annualLeave._id; sickLeave._id |
| dates | {from,to} | Date range | Yes | Next week range (Alice); today→next week (Bob) |
| durationDays | number | Duration days | Yes | 3 (Alice); 7 (Bob) |
| justification | string | Reason | Yes | Vacation; Medical leave |
| attachmentId | ObjectId | Attachment ref | Yes | medicalCertificate._id (Bob) |
| approvalFlow | array | Approval steps | Yes | [{role:'Manager',status:'Pending'}] (Alice); [{role:'HR',status:'Approved',decidedBy:alice._id,decidedAt:date}] (Bob) |
| status | enum(LeaveStatus) | Request status | Yes | PENDING (Alice); APPROVED (Bob) |
| irregularPatternFlag | boolean | Irregularity flag | No | Not found in seed files |

### Attachment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| originalName | string | Original filename | Yes | medical-report.pdf |
| filePath | string | Storage path | Yes | /attachments/medical-report.pdf |
| fileType | string | MIME type | Yes | application/pdf |
| size | number | File size | Yes | 350000 |

### Calendar

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| year | number | Calendar year | Yes | Current year |
| blockedPeriods | array | Blocked periods | Yes | [{ from: 2025-08-01, to: 2025-08-15, reason: Peak season blackout }] |
| holidays | ObjectId[] | Holiday refs | Yes | IDs of holidays seeded for the same year (linked at seed time) |

### LeaveAdjustment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.charlie._id |
| leaveTypeId | ObjectId | Leave type ref | Yes | annualLeave._id |
| adjustmentType | enum(AdjustmentType) | Adjustment kind | Yes | ADD |
| amount | number | Days delta | Yes | 2 |
| reason | string | Adjustment reason | Yes | Recognition award |
| hrUserId | ObjectId | HR actor | Yes | employees.alice._id |

## Fields Without Seed Values

- LeaveType: minTenureMonths, maxDurationDays.
- LeavePolicy: expiryAfterMonths, maxConsecutiveDays, eligibility.positionsAllowed, eligibility.contractTypesAllowed.
- LeaveEntitlement: carryForward, taken, pending, lastAccrualDate, nextResetDate.
- LeaveRequest: irregularPatternFlag.
- Calendar: none (holidays now populated from seeded holidays for the same year).

## Seeding Summary

- Total models: 8
- Total seeded fields: 46
- Total non-seeded fields: 10
- Notes/assumptions: Timestamps are auto-generated; current year used for calendar year; unspecified fields rely on defaults or runtime calculation.
