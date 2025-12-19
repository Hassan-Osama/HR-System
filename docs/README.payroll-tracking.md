# Payroll Tracking Subsystem

## Models

### claims

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| claimId | string | Claim code | Yes | CLAIM-001 |
| description | string | Claim description | Yes | Medical reimbursement for dental checkup |
| claimType | string | Claim category | Yes | Medical |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| amount | number | Claimed amount | Yes | 500 |
| status | enum(ClaimStatus) | Claim status | Yes | UNDER_REVIEW |
| financeStaffId | ObjectId | Finance staff | No | Not found in seed files |
| payrollSpecialistId | ObjectId | Payroll specialist | No | Not found in seed files |
| payrollManagerId | ObjectId | Payroll manager | No | Not found in seed files |
| approvedAmount | number | Approved amount | No | Not found in seed files |
| rejectionReason | string | Rejection reason | No | Not found in seed files |
| resolutionComment | string | Resolution comment | No | Not found in seed files |

### disputes

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| disputeId | string | Dispute code | Yes | DISP-001 |
| description | string | Dispute description | Yes | Incorrect tax calculation |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| payslipId | ObjectId | Payslip ref | Yes | payrollExecution.bobPayslip._id |
| status | enum(DisputeStatus) | Dispute status | Yes | UNDER_REVIEW |
| financeStaffId | ObjectId | Finance staff | No | Not found in seed files |
| payrollSpecialistId | ObjectId | Payroll specialist | No | Not found in seed files |
| payrollManagerId | ObjectId | Payroll manager | No | Not found in seed files |
| rejectionReason | string | Rejection reason | No | Not found in seed files |
| resolutionComment | string | Resolution comment | No | Not found in seed files |

### refunds

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| claimId | ObjectId | Claim ref | Yes | medicalClaim._id |
| refundDetails.description | string | Refund description | Yes | Approved Medical Claim |
| refundDetails.amount | number | Refund amount | Yes | 500 |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| financeStaffId | ObjectId | Finance staff | Yes | employees.alice._id |
| status | enum(RefundStatus) | Refund status | Yes | PENDING |
| disputeId | ObjectId | Dispute ref | No | Not found in seed files |
| paidInPayrollRunId | ObjectId | Payroll run that paid refund | No | Not found in seed files |

## Fields Without Seed Values

- claims: financeStaffId, payrollSpecialistId, payrollManagerId, approvedAmount, rejectionReason, resolutionComment.
- disputes: financeStaffId, payrollSpecialistId, payrollManagerId, rejectionReason, resolutionComment.
- refunds: disputeId, paidInPayrollRunId.

## Seeding Summary

- Total models: 3
- Total seeded fields: 17
- Total non-seeded fields: 13
- Notes/assumptions: Dispute seeding depends on availability of a payslip; approvals and resolutions are left for runtime processing.
