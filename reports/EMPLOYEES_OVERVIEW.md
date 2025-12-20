# Employees Overview

### 1) Summary

- Total employees: 28
- Total departments: 8
- Total positions: 21
- Total system roles: 11

### 2) Employees Table

| Employee Identifier | Position | Department | System Role(s) |
|---------------------|----------|------------|----------------|
| <alice@company.com> | HR Manager | Human Resources | HR_MANAGER |
| <bob@company.com> | Accountant | Finance | PAYROLL_SPECIALIST |
| <charlie@company.com> | Sales Representative | Sales | DEPARTMENT_EMPLOYEE |
| <diana@company.com> | Senior Software Engineer | Engineering | DEPARTMENT_HEAD |
| <eric@company.com> | Software Engineer | Engineering | DEPARTMENT_EMPLOYEE |
| <fatima@company.com> | HR Manager | Human Resources | SYSTEM_ADMIN |
| <george@company.com> | HR Generalist | Human Resources | LEGAL_POLICY_ADMIN |
| <hannah@company.com> | Accountant | Finance | FINANCE_STAFF |
| <ian@company.com> | HR Generalist | Human Resources | HR_ADMIN |
| <kevin@company.com> | HR Generalist | Human Resources | HR_EMPLOYEE |
| <lina@company.com> | QA Engineer | Engineering | DEPARTMENT_EMPLOYEE |
| <paula@company.com> | Accountant | Finance | PAYROLL_MANAGER |
| <rami@company.com> | HR Generalist | Human Resources | HR_ADMIN |
| <sarah.senior.swe@company.com> | Senior Software Engineer | Engineering | DEPARTMENT_EMPLOYEE |
| <samir.sales.lead@company.com> | Sales Lead | Sales | DEPARTMENT_EMPLOYEE |
| <tariq.ta@company.com> | TA | Learning and Development | DEPARTMENT_EMPLOYEE |
| <laila.la@company.com> | LA | Learning and Development | DEPARTMENT_EMPLOYEE |
| <amir.accountant@company.com> | Accountant | Finance | DEPARTMENT_EMPLOYEE |
| <salma.librarian@company.com> | Librarian | Library Services | DEPARTMENT_EMPLOYEE |
| <tess.headley@company.com> | Test Dept Head | Test Department | DEPARTMENT_HEAD |
| <evan.tester@company.com> | Test Dept Employee | Test Department | DEPARTMENT_EMPLOYEE |
| <inactive.ops-001-inactive@company.com> | Inactive - Operations (Inactive) Position | Operations (Inactive) | DEPARTMENT_EMPLOYEE |
| <head.eng-001@company.com> | Department Head - Engineering | Engineering | DEPARTMENT_HEAD |
| <head.sales-001@company.com> | Department Head - Sales | Sales | DEPARTMENT_HEAD |
| <head.lnd-001@company.com> | Department Head - Learning and Development | Learning and Development | DEPARTMENT_HEAD |
| <head.fin-001@company.com> | Department Head - Finance | Finance | DEPARTMENT_HEAD |
| <head.lib-001@company.com> | Department Head - Library Services | Library Services | DEPARTMENT_HEAD |
| <head.ops-001-inactive@company.com> | Department Head - Operations (Inactive) | Operations (Inactive) | DEPARTMENT_HEAD |

### 3) Notes / Findings

- Employees missing position or department: none observed in seeded data.
- Employees missing system roles: none; every seeded employee has exactly one role assigned.
- Inconsistencies: head positions are linked via Department.headPositionId per seeding audit; coverage employee added for inactive department.
