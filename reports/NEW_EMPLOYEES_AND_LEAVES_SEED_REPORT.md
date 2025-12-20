# New Employees and Leave Seeding Report

## Employees Added

- Tariq Adel — EMP-016 — <tariq.ta@company.com> — Position: TA — Department: Learning and Development
- Laila Abbas — EMP-017 — <laila.la@company.com> — Position: LA — Department: Learning and Development
- Amir Nabil — EMP-018 — <amir.accountant@company.com> — Position: Accountant — Department: Finance
- Salma Khaled — EMP-019 — <salma.librarian@company.com> — Position: Librarian — Department: Library Services

## Leave Distribution Summary

- Tariq Adel: Approved 1, Rejected 4, Pending 0
- Laila Abbas: Approved 3, Rejected 0, Pending 0
- Amir Nabil: Approved 1, Rejected 1, Pending 2
- Salma Khaled: Approved 1 (Unpaid), Rejected 0, Pending 0

## Unpaid Leave Confirmation

- Employee: Salma Khaled (EMP-019)
- Leave: Unpaid Leave (code UL), dates 2025-09-15 to 2025-09-17, status APPROVED, durationDays 3

## Notes

- Positions and departments created where missing: TA, LA under Learning and Development; Accountant under Finance; Librarian under Library Services.
- Seed reruns remain idempotent via collection clears and deterministic identifiers (employee numbers, emails, national IDs, leave date ranges).
