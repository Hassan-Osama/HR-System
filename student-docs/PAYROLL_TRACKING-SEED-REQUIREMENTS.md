# Payroll Tracking Seed Requirements

## 1) Subsystem Overview
Seeds claims, disputes, and refunds linked to payroll execution outputs for Charlie only; generates SEED_SCENARIO_VALIDATION_REPORT.md. Tracking collections are cleared each run for idempotency.

## 2) Collections / Models Seeded
- claims
- disputes
- refunds

## 3) REQUIRED Records (The Evaluation Checklist)

### Claims
| claimId | description | claimType | employeeId | amount | status |
| --- | --- | --- | --- | --- | --- |
| CLAIM-CHARLIE-001 | Payroll January 2025 adjustment claim | Payroll | charlie@company.com | 0 | UNDER_REVIEW |

### Disputes
| disputeId | description | employeeId | payslipId | status |
| --- | --- | --- | --- | --- |
| DISP-CHARLIE-001 | Missing bank account exception review | charlie@company.com | payslip from PR-2025-001 | UNDER_REVIEW |

### Refunds
- One refund for the dispute:

| disputeId | refundDetails.description | amount | employeeId | financeStaffId | status |
| --- | --- | --- | --- | --- | --- |
| DISP-CHARLIE-001 | Pending review for missing bank account exception | 0 | charlie@company.com | hannah@company.com | PENDING |

- No claim refunds beyond the single claim; collections are cleared before seeding.

Report: SEED_SCENARIO_VALIDATION_REPORT.md summarizing run employees, payroll details, payslips, claims/disputes/refund, and payroll config ownership.

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Refunds for disputes have amount 0 unless otherwise set.

## 5) Enums & Status Coverage
- ClaimStatus: UNDER_REVIEW used.
- DisputeStatus: UNDER_REVIEW used.
- RefundStatus: PENDING used.

## 6) Validation Notes
- Requires Charlie’s payslip from Payroll Execution; seeding will fail if not present.
- Claims/disputes/refunds upsert behavior ensures idempotency by IDs claimId/disputeId.

## 7) Minimum Acceptance Checklist
- Claim CLAIM-CHARLIE-001 exists (UNDER_REVIEW, employee Charlie).
- Dispute DISP-CHARLIE-001 exists (UNDER_REVIEW, employee Charlie, payslip PR-2025-001).
- One refund exists for the dispute (PENDING, financeStaff Hannah, amount 0). No extra refunds.
- SEED_SCENARIO_VALIDATION_REPORT.md reflects counts and ownership.
