# Payroll Seed Safety Report

## Issues Fixed

- Removed multi-run seeding; now seeds a single January 2025 payroll run (PR-2025-001) to avoid mismatched states.
- Enforced safe employee resolution by stable identifiers (employeeNumber/workEmail/firstName) with fail-fast on missing refs.
- Ensured terminationId validity by creating/reusing a concrete TerminationRequest when absent.
- Added deterministic upserts for payroll details, penalties, payslips, signing bonuses, and termination benefits to keep reruns idempotent.
- Limited payslip content to approved bonuses/benefits only; paymentDate set only for approved signing bonus.

## Assumptions

- Recruitment seed supplies a termination request or contract so terminationId can be created when needed.
- Payroll configuration provides approved seniorSigningBonus and endOfService benefit amounts; givenAmount must match these values.
- Income tax applied at 10% flat for this scenario; no insurance deductions are required for January 2025 run.

## Coverage

- Payroll run: PR-2025-001 (DRAFT, paymentStatus PENDING, entity "Tech Corp", specialist Bob).
- Employees covered: Charlie, Kevin, Lina, Sarah, Samir (single run, January 2025).
- Penalties: Charlie (2), Kevin (1), Sarah (1), Samir (1); none for Lina.
- Payslips: Include earnings (base, housing, transport), bonuses (Lina only), benefits (Charlie end-of-service), deductions (income tax), penalties per employee; paymentStatus PENDING.
- Signing bonuses: Lina APPROVED (paymentDate 2025-02-28), Kevin PENDING, Charlie PENDING, Bob REJECTED.
- Termination benefits: Charlie APPROVED (requires valid terminationId), Samir PENDING, Kevin PENDING, Sarah REJECTED.
