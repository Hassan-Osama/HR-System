# Payroll Execution Subsystem

## Models

### payrollRuns

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| runId | string | Payroll run code | Yes | PR-2025-001 |
| payrollPeriod | Date | Period end date | Yes | 2025-01-31 |
| status | enum(PayRollStatus) | Run status | Yes | DRAFT |
| entity | string | Company/entity | Yes | Tech Corp |
| employees | number | Employee count | Yes | 50 |
| exceptions | number | Exceptions count | Yes | 2 |
| totalnetpay | number | Total net pay | Yes | 500000 |
| payrollSpecialistId | ObjectId | Payroll specialist | Yes | employees.alice._id |
| paymentStatus | enum(PayRollPaymentStatus) | Payment status | Yes | PENDING |
| payrollManagerId | ObjectId | Payroll manager | Yes | employees.alice._id |
| financeStaffId | ObjectId | Finance staff | No | Not found in seed files |
| rejectionReason | string | Rejection note | No | Not found in seed files |
| unlockReason | string | Unlock reason | No | Not found in seed files |
| managerApprovalDate | Date | Manager approval date | No | Not found in seed files |
| financeApprovalDate | Date | Finance approval date | No | Not found in seed files |

### employeePayrollDetails

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| baseSalary | number | Base salary | Yes | 15000 |
| allowances | number | Total allowances | Yes | 3000 |
| deductions | number | Total deductions | Yes | 1500 |
| netSalary | number | Net salary | Yes | 16500 |
| netPay | number | Final net pay | Yes | 16500 |
| bankStatus | enum(BankStatus) | Bank data status | Yes | VALID |
| payrollRunId | ObjectId | Payroll run ref | Yes | janRun._id |
| exceptions | string | Exception flags | No | Not found in seed files |
| bonus | number | Bonus amount | No | Not found in seed files |
| benefit | number | Benefit amount | No | Not found in seed files |

### employeePenalties

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.charlie._id |
| penalties.reason | string | Penalty reason | Yes | Late Arrival |
| penalties.amount | number | Penalty amount | Yes | 100 |

### employeeSigningBonus

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| signingBonusId | ObjectId | Signing bonus ref | Yes | payrollConfig.bonuses.seniorSigningBonus._id |
| givenAmount | number | Granted amount | Yes | payrollConfig.bonuses.seniorSigningBonus.amount |
| paymentDate | Date | Planned payment date | Yes | 2025-02-28 |
| status | enum(BonusStatus) | Status | Yes | APPROVED |

### EmployeeTerminationResignation

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.charlie._id (conditional on termination data) |
| benefitId | ObjectId | Benefit ref | Yes | payrollConfig.benefits.endOfService._id |
| givenAmount | number | Granted amount | Yes | payrollConfig.benefits.endOfService.amount |
| terminationId | ObjectId | Termination request ref | Yes | recruitmentData.terminationRequest._id |
| status | enum(BenefitStatus) | Status | Yes | PENDING |

### paySlip

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| payrollRunId | ObjectId | Payroll run ref | Yes | janRun._id |
| earningsDetails.baseSalary | number | Base salary | Yes | 15000 |
| earningsDetails.allowances | allowance[] | Allowances | Yes | [{ Housing Allowance, 2000, APPROVED }, { Transport Allowance, 1000, APPROVED }] |
| earningsDetails.bonuses | signingBonus[] | Bonuses | Yes | [] |
| earningsDetails.benefits | termination benefits[] | Benefits | Yes | [] |
| earningsDetails.refunds | refundDetails[] | Refunds | Yes | [] |
| deductionsDetails.taxes | taxRules[] | Tax deductions | Yes | [{ name: Income Tax, rate: 10, status: APPROVED }] |
| deductionsDetails.insurances | insuranceBrackets[] | Insurance deductions | Yes | [] |
| deductionsDetails.penalties | employeePenalties | Penalties | Yes | null |
| totalGrossSalary | number | Gross salary | Yes | 18000 |
| totaDeductions | number | Total deductions | Yes | 1500 |
| netPay | number | Net pay | Yes | 16500 |
| paymentStatus | enum(PaySlipPaymentStatus) | Payment status | Yes | PENDING |

## Fields Without Seed Values

- payrollRuns: financeStaffId, rejectionReason, unlockReason, managerApprovalDate, financeApprovalDate.
- employeePayrollDetails: exceptions, bonus, benefit.

## Seeding Summary

- Total models: 6
- Total seeded fields: 45
- Total non-seeded fields: 8
- Notes/assumptions: EmployeeTerminationResignation is created only when recruitment termination data exists; deductionsDetails.penalties explicitly set to null in seed.
