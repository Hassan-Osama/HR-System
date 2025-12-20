# Payroll Execution Seed Requirements

## 1) Subsystem Overview
Seeds payroll run, payroll details per employee, penalties, payslips, and signing bonus assignments. Scoped to Jan 2025 run for three employees (Lina, Eric, Charlie). No extra payslip for Bob; no termination benefit assignments.

## 2) Collections / Models Seeded
- payrollRuns
- employeePayrollDetails
- employeePenalties
- paySlip
- employeeSigningBonus
- EmployeeTerminationResignation
- EmployeeProfile (read for resolution only)
- TerminationRequest (may be created if missing)

## 3) REQUIRED Records (The Evaluation Checklist)

### Payroll Run
| runId | payrollPeriod | status | entity | employees | exceptions | totalnetpay | payrollSpecialistId | paymentStatus |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PR-2025-001 | 2025-01-31 | DRAFT | Tech Corp | 3 | 1 | total from net pay | bob | PENDING |

### Payroll Rows → EmployeePayrollDetails & PaySlip
Common allowances: Housing Allowance 2000 APPROVED; Transport Allowance 1000 APPROVED. Income Tax rule 10%.

| Employee | baseSalary | Allowances | Bonuses | Benefits | Penalties | BankStatus | Exceptions | TaxRate | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| charlie@company.com | 9000 | Housing+Transport | none | End of Service Benefit (from payrollConfig) | Missing bank account penalty 150 | MISSING | "Missing bank account" | 10 | Generates payroll details + penalties + payslip |
| lina@company.com | 15000 | Housing+Transport | Signing Bonus (seniorSigningBonus approved) | none | none | VALID | — | 10 | |
| eric@company.com | 14000 | Housing+Transport | none | none | none | VALID | — | 10 | |

- For each row: employeePayrollDetails upserted with allowances total, deductions (tax + penalties), netPay, bankStatus, exceptions, payrollRunId.
- employeePenalties created/upserted when penalties exist.
- paySlip upserted per employee with earningsDetails (baseSalary, allowances, bonuses, benefits, refunds[]), deductionsDetails (taxes array with Income Tax rule; insurances[]; penalties only if present), totalGrossSalary, totaDeductions, netPay, paymentStatus PENDING.

### Employees Included (only)
- Lina, Eric, Charlie (no other employees in this run)

### Signing Bonus Assignments (employeeSigningBonus)
All reference payrollConfig.bonuses.seniorSigningBonus.
| Employee | givenAmount | status | paymentDate |
| --- | --- | --- | --- |
| lina@company.com | 5000 | APPROVED | 2025-02-28 |
| charlie@company.com | 5000 | PENDING | — |

### Termination Benefit Assignments
- None seeded in this scenario (not created).

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Some optional fields (exceptions, paymentDate) remain unset when not provided.

## 5) Enums & Status Coverage
- PayRollStatus: DRAFT used.
- PayRollPaymentStatus: PENDING used.
- BankStatus: MISSING, VALID used.
- PaySlipPaymentStatus: PENDING used.
- BonusStatus: APPROVED, PENDING, REJECTED used.
- BenefitStatus: APPROVED, PENDING, REJECTED used.

## 6) Validation Notes
- Employees must be resolved by employeeNumber/workEmail; failure should throw.
- payrollConfig bonuses/benefits must exist (seniorSigningBonus, endOfService).
- Upserts keyed by employeeId + payrollRunId for payroll details and payslips.

## 7) Minimum Acceptance Checklist
- Payroll run PR-2025-001 exists with draft status, payrollSpecialist bob, employees=3, exceptions=1.
- Three employee payroll detail records exist (Lina, Eric, Charlie) with correct amounts, deductions (tax 10% + penalties), and bank statuses.
- Payslips exist for Lina, Eric, Charlie.
- Penalties stored for Charlie only.
- Signing bonus assignments exist for Lina (approved, dated) and Charlie (pending).
- No termination benefit assignments are created in this scenario.
