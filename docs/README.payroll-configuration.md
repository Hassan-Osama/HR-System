# Payroll Configuration Subsystem

## Models

### payGrade

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| grade | string | Grade name | Yes | Junior; Senior |
| baseSalary | number | Base salary | Yes | 8000; 15000 |
| grossSalary | number | Gross salary | Yes | 10000; 20000 |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### allowance

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Allowance name | Yes | Housing Allowance; Transport Allowance |
| amount | number | Allowance amount | Yes | 2000; 1000 |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### payrollPolicies

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| policyName | string | Policy name | Yes | Standard Tax Policy |
| policyType | enum(PolicyType) | Policy type | Yes | DEDUCTION |
| description | string | Description | Yes | Applies standard tax rules |
| effectiveDate | Date | Effective date | Yes | 2025-01-01 |
| ruleDefinition.percentage | number | Percentage | Yes | 10 |
| ruleDefinition.fixedAmount | number | Fixed amount | Yes | 0 |
| ruleDefinition.thresholdAmount | number | Threshold | Yes | 5000 |
| applicability | enum(Applicability) | Applicability scope | Yes | AllEmployees |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### CompanyWideSettings

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| payDate | Date | Pay date | Yes | Current date at seeding |
| timeZone | string | Time zone | Yes | Africa/Cairo |
| currency | string | Currency | Yes | EGP |

### insuranceBrackets

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Bracket name | Yes | Social Insurance |
| status | enum(ConfigStatus) | Status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |
| minSalary | number | Minimum salary | Yes | 2000 |
| maxSalary | number | Maximum salary | Yes | 10000 |
| employeeRate | number | Employee rate % | Yes | 11 |
| employerRate | number | Employer rate % | Yes | 18.75 |

### payType

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| type | string | Pay type | Yes | Monthly Salary |
| amount | number | Amount | Yes | 6000 |
| status | enum(ConfigStatus) | Status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### signingBonus

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| positionName | string | Position name | Yes | Senior Developer |
| amount | number | Bonus amount | Yes | 5000 |
| status | enum(ConfigStatus) | Status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### taxRules

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Tax rule name | Yes | Standard Income Tax |
| description | string | Description | Yes | Standard income tax deduction |
| rate | number | Tax rate % | Yes | 10 |
| status | enum(ConfigStatus) | Status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

### terminationAndResignationBenefits

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Benefit name | Yes | End of Service Gratuity |
| amount | number | Benefit amount | Yes | 10000 |
| terms | string | Terms | Yes | After 1 year of service |
| status | enum(ConfigStatus) | Status | Yes | APPROVED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id |
| approvedAt | Date | Approval date | Yes | Current date at seeding |

## Fields Without Seed Values

- None identified; every schema field in this subsystem receives a seed value (timestamps auto-generated).

## Seeding Summary

- Total models: 9
- Total seeded fields: 63
- Total non-seeded fields: 0
- Notes/assumptions: Approval dates use the seeding runtime timestamp; all configs seeded as APPROVED for simplicity.
