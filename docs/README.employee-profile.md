# Employee Profile Subsystem

## Models

### EmployeeProfile

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| firstName | string | Given name | Yes | Alice; Bob; Charlie; Diana; Eric; Fatima; George; Hannah; Ian |
| lastName | string | Family name | Yes | Smith; Jones; Brown; Prince; Stone; Hassan; Ibrahim; Lee; Clark |
| fullName | string | Full name | Yes | Alice Smith; Bob Jones; Charlie Brown; Diana Prince; Eric Stone; Fatima Hassan; George Ibrahim; Hannah Lee; Ian Clark |
| nationalId | string | National identifier | Yes | NAT-ALICE-001; NAT-BOB-002; NAT-CHARLIE-003; NAT-DIANA-004; NAT-ERIC-005; NAT-FATIMA-006; NAT-GEORGE-007; NAT-HANNAH-008; NAT-IAN-009 |
| password | string | Auth password | Yes | password123 (all) |
| employeeNumber | string | Employee code | Yes | EMP-001 … EMP-009 |
| dateOfHire | Date | Hire date | Yes | 2020-01-01; 2021-05-15; 2022-03-10; 2019-07-01; 2023-04-12; 2018-11-20; 2010-02-15; 2025-01-05; 2017-06-18 |
| workEmail | string | Corporate email | Yes | <alice@company.com>; <bob@company.com>; <charlie@company.com>; <diana@company.com>; <eric@company.com>; <fatima@company.com>; <george@company.com>; <hannah@company.com>; <ian@company.com> |
| bankName | string | Bank name | Yes | First National Bank; Metro Credit Union; Global Savings; Capital Bank |
| bankAccountNumber | string | Bank account number | Yes | FNB-001-2020; MCU-002-2021; GS-003-2022; CB-004-2019; MCU-005-2023; FNB-006-2018; GS-007-2010; MCU-008-2025; CB-009-2017 |
| status | enum(EmployeeStatus) | Employment status | Yes | ACTIVE; INACTIVE; ON_LEAVE; SUSPENDED; RETIRED; PROBATION; TERMINATED |
| contractType | enum(ContractType) | Contract type | Yes | FULL_TIME_CONTRACT (Alice, Bob, Diana, Eric, Fatima, Ian); PART_TIME_CONTRACT (Charlie, George, Hannah) |
| workType | enum(WorkType) | Work arrangement | Yes | FULL_TIME (Alice, Bob, Diana, Eric, Fatima, Ian); PART_TIME (Charlie, George, Hannah) |
| gender | enum(Gender) | Gender | Yes | FEMALE (Alice, Diana, Fatima, Hannah); MALE (Bob, Charlie, Eric, George, Ian) |
| maritalStatus | enum(MaritalStatus) | Marital state | Yes | SINGLE (Alice, Charlie, Fatima, Hannah); MARRIED (Bob, George); DIVORCED (Diana, Ian); WIDOWED (Eric) |
| primaryPositionId | ObjectId | Primary position ref | Yes | positions.hrManagerPos; positions.softwareEngPos; positions.salesRepPos (reused across employees) |
| primaryDepartmentId | ObjectId | Primary department ref | Yes | departments.hrDept; departments.engDept; departments.salesDept (reused across employees) |
| middleName | string | Middle name | No | Not found in seed files |
| dateOfBirth | Date | Birth date | No | Not found in seed files |
| personalEmail | string | Personal email | No | Not found in seed files |
| mobilePhone | string | Mobile phone | No | Not found in seed files |
| homePhone | string | Home phone | No | Not found in seed files |
| address | Address | Residential address | No | Not found in seed files |
| profilePictureUrl | string | Avatar URL | No | Not found in seed files |
| accessProfileId | ObjectId | Access profile ref | No | Not found in seed files |
| biography | string | Bio | No | Not found in seed files |
| contractStartDate | Date | Contract start | No | Not found in seed files |
| contractEndDate | Date | Contract end | No | Not found in seed files |
| supervisorPositionId | ObjectId | Supervisor position | No | Not found in seed files |
| payGradeId | ObjectId | Pay grade ref | Yes | payrollConfig.payGrades.seniorGrade (Alice, Bob); payrollConfig.payGrades.juniorGrade (Charlie) |
| lastAppraisalRecordId | ObjectId | Last appraisal record | Yes | records[0]._id (Bob); records[1]._id (Charlie); records[2]._id (Alice) |
| lastAppraisalCycleId | ObjectId | Last appraisal cycle | Yes | cycle._id (2025 Annual Review Cycle) |
| lastAppraisalTemplateId | ObjectId | Last appraisal template | Yes | template._id (Annual Review Template 2025) |
| lastAppraisalDate | Date | Last appraisal date | Yes | 2025-03-01 (Bob); 2025-03-02 (Charlie); 2025-03-03 (Alice) |
| lastAppraisalScore | number | Last appraisal score | Yes | 4.3 (Bob); 3.3 (Charlie); 5 (Alice) |
| lastAppraisalRatingLabel | string | Last appraisal label | Yes | Exceeds Expectations (Bob); Meets Expectations (Charlie); Outstanding (Alice) |
| lastAppraisalScaleType | enum(AppraisalRatingScaleType) | Scale type | Yes | FIVE_POINT (all) |
| lastDevelopmentPlanSummary | string | Development plan summary | Yes | Consistently delivers high-quality work. (Bob); Solid contributor; focus on pipeline consistency. (Charlie); Sets the bar for leadership and delivery. (Alice) |
| statusEffectiveFrom | Date | Status effective date | No | Not found in seed files |

### EmployeeSystemRole

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeProfileId | ObjectId | Employee ref | Yes | alice._id; bob._id; charlie._id; diana._id; eric._id; fatima._id; george._id; hannah._id; ian._id |
| roles | SystemRole[] | Assigned roles | Yes | [HR_MANAGER, PAYROLL_MANAGER]; [PAYROLL_SPECIALIST, RECRUITER]; [DEPARTMENT_EMPLOYEE]; [DEPARTMENT_HEAD]; [HR_EMPLOYEE]; [SYSTEM_ADMIN]; [LEGAL_POLICY_ADMIN]; [FINANCE_STAFF]; [HR_ADMIN] |
| permissions | string[] | Extra permissions | Yes | ['org.manage', 'payroll.approve']; ['payroll.process', 'recruitment.view']; []; ['org.manage']; ['recruitment.view']; ['system.admin']; ['policy.manage']; ['finance.view']; ['hr.manage'] |
| isActive | boolean | Active flag | No | Not found in seed files (defaults true) |

### EmployeeProfileChangeRequest

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| requestId | string | Request code | Yes | REQ-EP-001 |
| employeeProfileId | ObjectId | Employee ref | Yes | charlie._id |
| requestDescription | string | Requested change | Yes | Update work email to <charlie.sales@company.com> |
| reason | string | Reason | Yes | Team branding alignment |
| status | enum(ProfileChangeStatus) | Request status | Yes | PENDING |
| submittedAt | Date | Submitted time | No | Not found in seed files (timestamp default) |
| processedAt | Date | Processed time | No | Not found in seed files |

### EmployeeQualification

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeProfileId | ObjectId | Employee ref | Yes | alice._id; bob._id |
| establishmentName | string | Institution | Yes | Cairo University; AUC |
| graduationType | enum(GraduationType) | Graduation level | Yes | MASTER (Alice); BACHELOR (Bob) |

## Fields Without Seed Values

- EmployeeProfile: middleName, dateOfBirth, personalEmail, mobilePhone, homePhone, address, profilePictureUrl, accessProfileId, biography, contractStartDate, contractEndDate, supervisorPositionId, statusEffectiveFrom (optional/runtime, many nullable; timestamps auto-generated).
- EmployeeSystemRole: isActive (defaults true).
- EmployeeProfileChangeRequest: submittedAt, processedAt (timestamps/processing time).

## Seeding Summary

- Total models: 4
- Total seeded fields: 37
- Total non-seeded fields: 16
- Notes/assumptions: Timestamps (`createdAt`, `updatedAt`) are auto-generated by Mongoose and not explicitly seeded.
