# Payroll Configuration Subsystem

## Models

### payGrade

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| grade | string | Grade name | Yes | Junior (APPROVED); Senior (APPROVED); Mid Draft (DRAFT); Intern Rejected (REJECTED) |
| baseSalary | number | Base salary | Yes | 8000; 15000; 10000; 6000 |
| grossSalary | number | Gross salary | Yes | 11000; 18000; 13000; 9000 |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED; APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### allowance

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Allowance name | Yes | Housing approved Allowance (APPROVED); Transport Approved Allowance (APPROVED); Meal Draft Allowance (DRAFT); Telephone Rejected Allowance (REJECTED) |
| amount | number | Allowance amount | Yes | 2000; 1000; 1000; 1000 |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED; APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### payrollPolicies

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| policyName | string | Policy name | Yes | Standard Approved Tax Policy (DEDUCTION, APPROVED); Standard Draft Allowance Policy (ALLOWANCE, DRAFT); Standard Rejected Benfit Policy (BENEFIT, REJECTED) |
| policyType | enum(PolicyType) | Policy type | Yes | DEDUCTION; ALLOWANCE; BENEFIT |
| description | string | Description | Yes | Applies standard tax rules; Applies standard allowance rules; Applies standard Benfit rules |
| effectiveDate | Date | Effective date | Yes | 2025-01-01 for all |
| ruleDefinition.percentage | number | Percentage | Yes | 10; 20; 20 |
| ruleDefinition.fixedAmount | number | Fixed amount | Yes | 0 for all |
| ruleDefinition.thresholdAmount | number | Threshold | Yes | 5000; 4000; 4000 |
| applicability | enum(Applicability) | Applicability scope | Yes | AllEmployees |
| status | enum(ConfigStatus) | Config status | Yes | APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### CompanyWideSettings

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| payDate | Date | Pay date | Yes | Current date at seeding |
| timeZone | string | Time zone | Yes | Africa/Cairo |
| currency | string | Currency | Yes | EGP |

### insuranceBrackets

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Bracket name | Yes | Social Insurance (APPROVED x3); Medical Insurance Draft (DRAFT); Car Insurance Rejected (REJECTED) |
| status | enum(ConfigStatus) | Status | Yes | APPROVED (three brackets); DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |
| minSalary | number | Minimum salary | Yes | 0; 3001; 9001; 2000; 2000 |
| maxSalary | number | Maximum salary | Yes | 3000; 9000; 100000; 10000; 10000 |
| employeeRate | number | Employee rate % | Yes | 8; 10; 12; 11; 11 |
| employerRate | number | Employer rate % | Yes | 14; 16; 18; 18.75; 18.75 |

### payType

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| type | string | Pay type | Yes | Monthly Approved Salary (APPROVED); Hourly Draft Salary (DRAFT); Contact Rejected Salary (REJECTED) |
| amount | number | Amount | Yes | 6000 for all |
| status | enum(ConfigStatus) | Status | Yes | APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### signingBonus

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| positionName | string | Position name | Yes | Senior Developer (APPROVED); Junior Developer (APPROVED); Mid Developer (DRAFT); Intern Developer (REJECTED) |
| amount | number | Bonus amount | Yes | 5000; 1000; 3000; 500 |
| status | enum(ConfigStatus) | Status | Yes | APPROVED; APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### taxRules

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Tax rule name | Yes | Standard Income Tax (APPROVED); Sales Tax Draft (DRAFT); VAT Tax Rejected (REJECTED) |
| description | string | Description | Yes | Standard income tax deduction; Sales tax deduction; VAT tax deduction |
| rate | number | Tax rate % | Yes | 10; 20; 14 |
| status | enum(ConfigStatus) | Status | Yes | APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

### terminationAndResignationBenefits

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Benefit name | Yes | End of Service Gratuity (APPROVED); Compensation Benefit Draft (DRAFT); Notice Period Benefit Rejected (REJECTED) |
| amount | number | Benefit amount | Yes | 10000 for all |
| terms | string | Terms | Yes | After 1 year of service for all |
| status | enum(ConfigStatus) | Status | Yes | APPROVED; DRAFT; REJECTED |
| createdBy | ObjectId | Creator | Yes | employees.alice._id |
| approvedBy | ObjectId | Approver | Yes | employees.alice._id for approved/rejected rows |
| approvedAt | Date | Approval date | Yes | Current date at seeding for approved/rejected rows |

## Fields Without Seed Values

- None identified; every schema field in this subsystem receives a seed value (timestamps auto-generated for created/updated, approval fields omitted for draft rows).

## Seeding Summary

- Total models: 9
- Total seeded fields: 90+
- Total non-seeded fields: 0
- Notes/assumptions: Approval dates use the seeding runtime timestamp; draft rows intentionally omit approval metadata; rejected rows still carry approval metadata.
