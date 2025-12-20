# One Role Per Employee and Coverage Report

## Employees Fixed (multiple roles → single role)

- Alice Smith (EMP-001 / NAT-ALICE-001): HR Manager; Payroll Manager → HR Manager (kept highest priority HR)
- Bob Jones (EMP-002 / NAT-BOB-002): Payroll Specialist; Recruiter → Payroll Specialist (kept highest priority employee-tier role over other)

## Newly Created Employees (for missing roles post-normalization)

- Paula Payne (EMP-012 / NAT-PAULA-012) – Role: Payroll Manager – Dept: Human Resources – Position: hrManagerPos
- Rami Reed (EMP-013 / NAT-RAMI-013) – Role: Recruiter – Dept: Human Resources – Position: hrGeneralistPos

## Positions/Departments Created

- None (used existing HR positions/departments)

## Final Role → Employee Mapping (one role per employee)

- HR Manager: Alice Smith
- Payroll Manager: Paula Payne
- Payroll Specialist: Bob Jones
- Department Head: Diana Prince
- Department Employee: Charlie Brown; Kevin Adams; Lina Park
- HR Employee: Eric Stone
- System Admin: Fatima Hassan
- Legal & Policy Admin: George Ibrahim
- Recruiter: Rami Reed
- Finance Staff: Hannah Lee
- HR Admin: Ian Clark
- Job Candidate: (excluded per requirement)

## Notes

- All employees now have exactly one system role.
- All SystemRole enum values except JOB_CANDIDATE are assigned to at least one employee.
- No existing employees or roles were removed; roles were normalized and two employees were added to maintain coverage.
