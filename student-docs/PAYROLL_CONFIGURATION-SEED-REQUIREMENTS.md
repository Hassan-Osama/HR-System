# Payroll Configuration Seed Requirements

## 1) Subsystem Overview
Seeds pay grades, allowances, insurance brackets, pay types, signing bonuses, tax rules, termination benefits, payroll policies, company-wide settings, and synchronizes pay grades to positions.

## 2) Collections / Models Seeded
- CompanyWideSettings
- payGrade
- allowance
- insuranceBrackets
- payType
- signingBonus
- taxRules
- terminationAndResignationBenefits
- payrollPolicies
- Position (updated for pay grade sync report only)

## 3) REQUIRED Records (The Evaluation Checklist)

### CompanyWideSettings
| Field | Value |
| --- | --- |
| payDate | (date of seeding) |
| timeZone | Africa/Cairo |
| currency | EGP |

### Pay Grades
| Grade | baseSalary | grossSalary | Status | createdBy | approvedBy | approvedAt |
| --- | --- | --- | --- | --- | --- | --- |
| Junior | 8000 | 11000 | APPROVED | bob | paula | date(now) |
| Senior | 15000 | 18000 | APPROVED | bob | paula | date(now) |
| Mid Draft | 10000 | 13000 | DRAFT | bob | — | — |
| Intern Rejected | 6000 | 9000 | REJECTED | bob | — | — |
| PayGrades for each Position title | baseSalary/grossSalary copied from template; status per template (default DRAFT); created for every Position lacking same-name payGrade |

### Allowances
| Name | Amount | Status | createdBy | approvedBy | approvedAt |
| --- | --- | --- | --- | --- | --- |
| Housing approved Allowance | 2000 | APPROVED | bob | paula | date(now) |
| Transport Approved Allowance | 1000 | APPROVED | bob | paula | date(now) |
| Meal Draft Allowance | 1000 | DRAFT | bob | — | — |
| Telephone Rejected Allowance | 1000 | REJECTED | bob | — | — |

### Insurance Brackets
| Name | Status | minSalary | maxSalary | employeeRate | employerRate | amount |
| --- | --- | --- | --- | --- | --- | --- |
| Social Insurance | APPROVED | 0 | 3000 | 8 | 14 | — |
| Social Insurance | APPROVED | 3001 | 9000 | 10 | 16 | — |
| Social Insurance | APPROVED | 9001 | 100000 | 12 | 18 | — |
| Medical Insurance Draft | DRAFT | 2000 | 10000 | 11 | 18.75 | amount 500 |
| Car Insurance Rejected | REJECTED | 2000 | 10000 | 11 | 18.75 | amount 500 |

### Pay Types
| Type | Amount | Status | createdBy | approvedBy |
| --- | --- | --- | --- | --- |
| Monthly Approved Salary | 6000 | APPROVED | bob | paula |
| Hourly Draft Salary | 6000 | DRAFT | bob | — |
| Contact Rejected Salary | 6000 | REJECTED | bob | — |

### Signing Bonuses
| Position Name | Amount | Status | createdBy | approvedBy |
| --- | --- | --- | --- | --- |
| Senior Developer | 5000 | APPROVED | bob | paula |
| Junior Developer | 1000 | APPROVED | bob | paula |
| Mid Developer | 3000 | DRAFT | bob | — |
| Intern Developer | 500 | REJECTED | bob | — |

### Tax Rules
| Name | Description | Rate | Status | createdBy | approvedBy |
| --- | --- | --- | --- | --- | --- |
| Standard Income Tax | Standard income tax deduction | 10 | APPROVED | bob | paula |
| Sales Tax Draft | Sales tax deduction | 20 | DRAFT | bob | — |
| VAT Tax Rejected | VAT tax deduction | 14 | REJECTED | bob | — |

### Termination & Resignation Benefits
| Name | Amount | Terms | Status | createdBy | approvedBy |
| --- | --- | --- | --- | --- | --- |
| End of Service Gratuity | 10000 | After 1 year of service | APPROVED | bob | paula |
| Compensation Benefit Draft | 10000 | After 1 year of service | DRAFT | bob | — |
| Notice Period Benefit Rejected | 10000 | After 1 year of service | REJECTED | bob | — |

### Payroll Policies
| policyName | policyType | description | effectiveDate | ruleDefinition | applicability | status | createdBy | approvedBy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard Approved Tax Policy | DEDUCTION | Applies standard tax rules | 2025-01-01 | percentage 10; fixedAmount 0; thresholdAmount 5000 | AllEmployees | APPROVED | bob | paula |
| Standard Draft Allowance Policy | ALLOWANCE | Applies standard allowance rules | 2025-01-01 | percentage 20; fixedAmount 0; thresholdAmount 4000 | AllEmployees | DRAFT | bob | — |
| Standard Rejected Benfit Policy | BENEFIT | Applies standard  Benfit rules | 2025-01-01 | percentage 20; fixedAmount 0; thresholdAmount 4000 | AllEmployees | REJECTED | bob | — |

### PayGrade Position Sync
- A report is generated aligning payGrades to every Position title; new payGrades are created if missing, using the template pay grade values.

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- Many approval metadata fields (approvedAt) set only where shown; otherwise remain unset.

## 5) Enums & Status Coverage
- ConfigStatus: APPROVED, DRAFT, REJECTED all represented across entities.
- PolicyType: DEDUCTION, ALLOWANCE, BENEFIT used.
- Applicability: AllEmployees used.

## 6) Validation Notes
- Unique fields: payGrade.grade, allowance.name, insuranceBrackets name+range, payType.type, signingBonus.positionName, taxRules.name, terminationAndResignationBenefits.name, payrollPolicies.policyName must match exactly.
- createdBy/approvedBy reference EmployeeProfile (alice) seeded earlier; ensure employees exist first.
- PayGrade sync depends on Position records from Organization Structure.

## 7) Minimum Acceptance Checklist
- CompanyWideSettings has Africa/Cairo timezone and EGP currency.
- Four base pay grades (Junior, Senior, Mid Draft, Intern Rejected) with exact salaries/statuses, plus auto-created grades for every position title.
- Four allowances with statuses as listed.
- Five insurance bracket entries with ranges/rates/amounts exactly as shown.
- Three pay types; four signing bonuses; three tax rules; three termination benefits; three payroll policies with stated fields.
- PayGrade position sync executed so each Position has a corresponding payGrade record.
