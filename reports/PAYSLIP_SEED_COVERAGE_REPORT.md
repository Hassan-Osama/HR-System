# PaySlip Seed Coverage Report

## Exclusion

- Excluded employee: Bob Jones (EMP-002, <bob@company.com>) — matched by firstName "Bob" / employeeNumber EMP-002 / workEmail <bob@company.com>.

## Employee Coverage

- Total employees detected: 19
- Included for payslips: 18 (all except Bob)
- Excluded: 1 (Bob)

## Enum Coverage

|Enum Name|Enum Value|Covered Before|Covered After|PaySlip Identifier|
|---|---|---|---|---|
|PaySlipPaymentStatus|pending|Yes (Bob legacy)|Yes|EMP-003-PR-2025-UR|
|PaySlipPaymentStatus|paid|No|Yes|EMP-001-PR-2025-001|
|PayRollStatus|draft|Yes|Yes|EMP-001-PR-2025-001|
|PayRollStatus|under review|No|Yes|EMP-003-PR-2025-UR|
|PayRollStatus|pending finance approval|No|Yes|EMP-014-PR-2025-PF|
|PayRollStatus|rejected|No|Yes|EMP-005-PR-2025-REJ|
|PayRollStatus|approved|No|Yes|EMP-012-PR-2025-APR|
|PayRollStatus|locked|No|Yes|EMP-007-PR-2025-LOCK|
|PayRollStatus|unlocked|No|Yes|EMP-015-PR-2025-UNLOCK|
|PayRollPaymentStatus|pending|Yes|Yes|EMP-003-PR-2025-UR|
|PayRollPaymentStatus|paid|No|Yes|EMP-012-PR-2025-APR|

## Scenario Coverage

- bonus-only: EMP-001-PR-2025-001
- deduction-only: EMP-003-PR-2025-UR
- overtime (via allowances): EMP-005-PR-2025-REJ
- bonus + deductions: EMP-014-PR-2025-PF
- benefit + refund: EMP-004-PR-2025-APR
- empty optional arrays: EMP-007-PR-2025-LOCK
- unpaid/paid status split: pending examples above; paid examples above

## Per-Employee Summary (excluding Bob)

| Employee                 | # PaySlips | Period(s)     |
| ------------------------ | ---------- | ------------- |
| Alice Smith (EMP-001)    | 1          | PR-2025-001   |
| Charlie Brown (EMP-003)  | 1          | PR-2025-UR    |
| Diana Prince (EMP-004)   | 1          | PR-2025-APR   |
| Eric Stone (EMP-005)     | 1          | PR-2025-REJ   |
| Fatima Hassan (EMP-006)  | 1          | PR-2025-APR   |
| George Ibrahim (EMP-007) | 1          | PR-2025-LOCK  |
| Hannah Lee (EMP-008)     | 1          | PR-2025-UNLOCK|
| Ian Clark (EMP-009)      | 1          | PR-2025-001   |
| Kevin Adams (EMP-010)    | 1          | PR-2025-UR    |
| Lina Park (EMP-011)      | 1          | PR-2025-PF    |
| Paula Payne (EMP-012)    | 1          | PR-2025-APR   |
| Rami Reed (EMP-013)      | 1          | PR-2025-LOCK  |
| Sarah Nguyen (EMP-014)   | 1          | PR-2025-PF    |
| Samir Saleh (EMP-015)    | 1          | PR-2025-UNLOCK|
| Tariq Adel (EMP-016)     | 1          | PR-2025-001   |
| Laila Abbas (EMP-017)    | 1          | PR-2025-UR    |
| Amir Nabil (EMP-018)     | 1          | PR-2025-PF    |
| Salma Khaled (EMP-019)   | 1          | PR-2025-REJ   |

## Notes

- Payslip identifiers follow EMP-XXX + payroll run ID. Values above assume default seed order; reruns remain idempotent via upsert on (employeeId, payrollRunId).
- Existing Bob payslip retained for downstream seeds; no additional Bob payslips were added.
