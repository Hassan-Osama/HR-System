# Employee Profile Seed Requirements

## 1) Subsystem Overview
Seeds employee profiles, system roles, qualifications, and a sample profile change request; generates coverage employees for inactive departments and department-head role assignments.

## 2) Collections / Models Seeded
- EmployeeProfile
- EmployeeSystemRole
- EmployeeQualification
- EmployeeProfileChangeRequest

## 3) REQUIRED Records (The Evaluation Checklist)

### EmployeeProfile (core employees)
All employees share: status ACTIVE, contractType FULL_TIME_CONTRACT unless noted, workType FULL_TIME unless noted, password set (hash of `ChangeMe123`).

| Work Email | First | Last | Employee # | National ID | Dept (primary) | Position (primary) | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| alice@company.com | Alice | Smith | EMP-001 | NAT-ALICE-001 | HR-001 | POS-HR-MGR | Gender FEMALE; marital SINGLE; bank First National Bank FNB-001-2020 |
| bob@company.com | Bob | Jones | EMP-002 | NAT-BOB-002 | FIN-001 | POS-ACC | Gender MALE; marital MARRIED; bank Metro CU MCU-002-2021 |
| charlie@company.com | Charlie | Brown | EMP-003 | NAT-CHARLIE-003 | SALES-001 | POS-SALES-REP | PART_TIME_CONTRACT; PART_TIME; marital SINGLE |
| diana@company.com | Diana | Prince | EMP-004 | NAT-DIANA-004 | ENG-001 | POS-SENIOR-SWE | marital DIVORCED |
| eric@company.com | Eric | Stone | EMP-005 | NAT-ERIC-005 | ENG-001 | POS-SWE | marital WIDOWED |
| fatima@company.com | Fatima | Hassan | EMP-006 | NAT-FATIMA-006 | HR-001 | POS-HR-MGR | marital SINGLE |
| george@company.com | George | Ibrahim | EMP-007 | NAT-GEORGE-007 | HR-001 | POS-HR-GEN | PART_TIME_CONTRACT; PART_TIME; marital MARRIED |
| hannah@company.com | Hannah | Lee | EMP-008 | NAT-HANNAH-008 | FIN-001 | POS-ACC | PART_TIME_CONTRACT; PART_TIME; marital SINGLE |
| ian@company.com | Ian | Clark | EMP-009 | NAT-IAN-009 | HR-001 | POS-HR-GEN | marital DIVORCED |
| kevin@company.com | Kevin | Adams | EMP-010 | NAT-KEVIN-010 | HR-001 | POS-HR-GEN | marital MARRIED |
| lina@company.com | Lina | Park | EMP-011 | NAT-LINA-011 | ENG-001 | POS-QA-ENG | marital SINGLE |
| paula@company.com | Paula | Payne | EMP-012 | NAT-PAULA-012 | FIN-001 | POS-ACC | marital SINGLE |
| rami@company.com | Rami | Reed | EMP-013 | NAT-RAMI-013 | HR-001 | POS-HR-GEN | marital SINGLE |
| sarah.senior.swe@company.com | Sarah | Nguyen | EMP-014 | NAT-SARAH-014 | ENG-001 | POS-SENIOR-SWE | marital SINGLE |
| samir.sales.lead@company.com | Samir | Saleh | EMP-015 | NAT-SAMIR-015 | SALES-001 | POS-SALES-LEAD | marital MARRIED |
| tariq.ta@company.com | Tariq | Adel | EMP-016 | NAT-TARIQ-016 | LND-001 | POS-TA | marital SINGLE |
| laila.la@company.com | Laila | Abbas | EMP-017 | NAT-LAILA-017 | LND-001 | POS-LA | marital SINGLE |
| amir.accountant@company.com | Amir | Nabil | EMP-018 | NAT-AMIR-018 | FIN-001 | POS-ACC | marital MARRIED |
| salma.librarian@company.com | Salma | Khaled | EMP-019 | NAT-SALMA-019 | LIB-001 | POS-LIB | marital SINGLE |
| tess.headley@company.com | Tess | Headley | EMP-TEST-020 | NAT-TEST-HEAD-020 | TEST-001 | POS-TEST-HEAD | marital SINGLE |
| evan.tester@company.com | Evan | Tester | EMP-TEST-021 | NAT-TEST-EMP-021 | TEST-001 | POS-TEST-EMP | marital SINGLE |
| inactive.ops-001-inactive@company.com | Inactive Operations (generated) | — | EMP-INACTIVE-OPS-001-INACTIVE | NAT-INACTIVE-OPS-001-INACTIVE | OPS-001-INACTIVE | POS-OPS-001-INACTIVE-INACTIVE-COVERAGE | Coverage employee (generated for inactive dept) |
| head.eng-001@company.com | Head Engineering | EMP-HEAD-ENG-001 | NAT-HEAD-ENG-001 | ENG-001 | POS-ENG-001-HEAD (Department Head - Engineering) | Department head auto-created |
| head.sales-001@company.com | Head Sales | EMP-HEAD-SALES-001 | NAT-HEAD-SALES-001 | SALES-001 | POS-SALES-001-HEAD (Department Head - Sales) | Department head auto-created |
| head.lnd-001@company.com | Head Learning and Development | EMP-HEAD-LND-001 | NAT-HEAD-LND-001 | LND-001 | POS-LND-001-HEAD | Department head auto-created |
| head.fin-001@company.com | Head Finance | EMP-HEAD-FIN-001 | NAT-HEAD-FIN-001 | FIN-001 | POS-FIN-001-HEAD | Department head auto-created |
| head.lib-001@company.com | Head Library Services | EMP-HEAD-LIB-001 | NAT-HEAD-LIB-001 | LIB-001 | POS-LIB-001-HEAD | Department head auto-created |
| head.ops-001-inactive@company.com | Head Operations (Inactive) | EMP-HEAD-OPS-001-INACTIVE | NAT-HEAD-OPS-001-INACTIVE | OPS-001-INACTIVE | POS-OPS-001-INACTIVE-HEAD | Department head auto-created |
| head.hr-001@company.com | Head Human Resources | EMP-HEAD-HR-001 | NAT-HEAD-HR-001 | HR-001 | POS-HR-MGR (headPositionId already HR Manager) | May resolve to Alice if found; otherwise generated head.* employee |

### EmployeeSystemRole
Head role assignments are created for every department with headPositionId. Base roles exclude head employees to avoid duplicates.

| Work Email | Roles | Permissions |
| --- | --- | --- |
| alice@company.com | HR_MANAGER | org.manage, hr.manage |
| bob@company.com | PAYROLL_SPECIALIST | payroll.process |
| charlie@company.com | DEPARTMENT_EMPLOYEE | (none) |
| diana@company.com | DEPARTMENT_EMPLOYEE | org.read |
| eric@company.com | HR_EMPLOYEE | hr.view |
| fatima@company.com | SYSTEM_ADMIN | system.admin |
| george@company.com | HR_EMPLOYEE | hr.view |
| hannah@company.com | FINANCE_STAFF | finance.view |
| ian@company.com | HR_ADMIN | hr.manage |
| kevin@company.com | DEPARTMENT_EMPLOYEE | (none) |
| lina@company.com | DEPARTMENT_EMPLOYEE | (none) |
| paula@company.com | FINANCE_STAFF | finance.view |
| rami@company.com | HR_ADMIN | hr.manage |
| sarah.senior.swe@company.com | DEPARTMENT_EMPLOYEE | org.read |
| samir.sales.lead@company.com | DEPARTMENT_EMPLOYEE | org.read |
| tariq.ta@company.com | DEPARTMENT_EMPLOYEE | org.read |
| laila.la@company.com | DEPARTMENT_EMPLOYEE | org.read |
| amir.accountant@company.com | DEPARTMENT_EMPLOYEE | finance.view |
| salma.librarian@company.com | DEPARTMENT_EMPLOYEE | org.read |
| evan.tester@company.com | DEPARTMENT_EMPLOYEE | org.read |
| head.* employees (per dept) | DEPARTMENT_HEAD | org.manage.department |
| inactive.ops-001-inactive@company.com | DEPARTMENT_EMPLOYEE | org.read |

### EmployeeQualification
| employeeProfileId (email) | establishmentName | graduationType |
| --- | --- | --- |
| alice@company.com | Cairo University | MASTER |
| bob@company.com | AUC | BACHELOR |

### EmployeeProfileChangeRequest
| requestId | employee | description | reason | status |
| --- | --- | --- | --- | --- |
| REQ-EP-001 | charlie@company.com | Update work email to charlie.sales@company.com | Team branding alignment | PENDING |

### Reports (for reference only)
- TEST_DEPARTMENT_SEED_REPORT.md, DEPARTMENT_HEAD_SCENARIO_REPORT.md, INACTIVE_DEPARTMENT_COVERAGE_REPORT.md, DEPARTMENT_HEAD_ROLES_AUDIT_REPORT.md are generated; students must ensure underlying data matches.

## 4) Fields Without Seed Values
- Auto-generated: `_id`, timestamps.
- Password hash is generated from `ChangeMe123` (value not stored as plain text).
- Any schema fields not listed (e.g., optional contact info) remain unset.

## 5) Enums & Status Coverage
- EmployeeStatus: ACTIVE used for all.
- ContractType: FULL_TIME_CONTRACT for most; PART_TIME_CONTRACT for Charlie, George, Hannah.
- WorkType: FULL_TIME for all except Charlie/George/Hannah PART_TIME.
- SystemRole coverage listed above.
- Gender: FEMALE (Alice, Fatima, Hannah, Laila, Salma, Tess), MALE (others).
- MaritalStatus: varied as shown in table.

## 6) Validation Notes
- Uniqueness: workEmail, employeeNumber, nationalId are used to dedupe; must be unique per record.
- headPositionId must correspond to positions from Organization Structure; head employees are created if none match primaryPositionId.
- Coverage employee and position exist for inactive department OPS-001-INACTIVE.

## 7) Minimum Acceptance Checklist
- EmployeeProfile contains all rows listed with matching identifiers, departments, and positions.
- EmployeeSystemRole contains exactly the role mappings shown (one role per employee except head roles auto-added).
- Qualifications exist for Alice and Bob as specified.
- Profile change request REQ-EP-001 exists for Charlie with pending status.
- Coverage employee and all head.* employees exist with DEPARTMENT_HEAD or DEPARTMENT_EMPLOYEE as described.
