# Employee System Roles Report

## 1) Summary

- Total employees: 11
- Total system role enum values: 12 (including JOB_CANDIDATE)
- Employees with at least one system role: 11/11 (all employees have roles)

## 2) Employee Role Mapping

Employee Identifier | Employee Name | User Identifier | Assigned System Role(s)
--- | --- | --- | ---
EMP-001 (NAT-ALICE-001) | Alice Smith | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | HR Manager; Payroll Manager
EMP-002 (NAT-lina-002) | lina Jones | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Payroll Specialist; Recruiter
EMP-003 (NAT-CHARLIE-003) | Charlie Brown | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Department employee
EMP-004 (NAT-DIANA-004) | Diana Prince | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Department head
EMP-005 (NAT-ERIC-005) | Eric Stone | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | HR Employee
EMP-006 (NAT-FATIMA-006) | Fatima Hassan | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | System Admin
EMP-007 (NAT-GEORGE-007) | George Ibrahim | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Legal & Policy Admin
EMP-008 (NAT-HANNAH-008) | Hannah Lee | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Finance Staff
EMP-009 (NAT-IAN-009) | Ian Clark | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | HR Admin
EMP-010 (NAT-KEVIN-010) | Kevin Adams | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Department employee
EMP-011 (NAT-LINA-011) | Lina Park | Not applicable (no separate user record; roles linked via EmployeeProfile._id) | Department employee

## 3) Role Coverage Summary

System Role | Number of Employees Assigned
--- | ---
department employee | 3 (Charlie Brown; Kevin Adams; Lina Park)
department head | 1 (Diana Prince)
HR Manager | 1 (Alice Smith)
HR Employee | 1 (Eric Stone)
Payroll Specialist | 1 (lina Jones)
Payroll Manager | 1 (Alice Smith)
System Admin | 1 (Fatima Hassan)
Legal & Policy Admin | 1 (George Ibrahim)
Recruiter | 1 (lina Jones)
Finance Staff | 1 (Hannah Lee)
Job Candidate | 0 (not assigned in seeds)
HR Admin | 1 (Ian Clark)

## 4) Findings / Notes

- All seeded employees have at least one system role via EmployeeSystemRole entries keyed by employeeProfileId.
- JOB_CANDIDATE exists in the enum but has no seeded assignment.
- No standalone user/auth documents are seeded; role linkage is from EmployeeProfile -> EmployeeSystemRole.employeeProfileId. User identifiers beyond employee/national IDs are not resolvable from current seed data.
