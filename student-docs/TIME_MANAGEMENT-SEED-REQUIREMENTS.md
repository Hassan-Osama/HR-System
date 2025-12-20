# Time Management Seed Requirements

## 1) Subsystem Overview
Seeds shift types, shifts, holidays, shift assignments, and attendance records used for payroll readiness.

## 2) Collections / Models Seeded
- ShiftType
- Shift
- Holiday
- ShiftAssignment
- AttendanceRecord

## 3) REQUIRED Records (The Evaluation Checklist)

### ShiftType
| name | active |
| --- | --- |
| Morning Shift | true |

### Shifts
| name | shiftType | startTime | endTime | punchPolicy | graceInMinutes | graceOutMinutes | requiresApprovalForOvertime | active |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard Morning (9-5) | Morning Shift | 09:00 | 17:00 | FIRST_LAST | 15 | 15 | true | true |
| SW@Standard Day (9-5) | Morning Shift | 09:00 | 17:00 | FIRST_LAST | 15 | 15 | true | true |

### Holiday
| type | startDate | name | active |
| --- | --- | --- | --- |
| NATIONAL | 2025-01-01 | New Year | true |

### ShiftAssignment
| employee | shift | startDate | status |
| --- | --- | --- | --- |
| lina@company.com | SW@Standard Day (9-5) | 2025-12-01 | APPROVED |
| charlie@company.com | Standard Morning (9-5) | 2025-12-01 | APPROVED |

### AttendanceRecord
- Working days list: 2025-12-01 to 2025-12-10 inclusive.

| employee | day(s) | punches | totalWorkMinutes | hasMissedPunch | finalisedForPayroll |
| --- | --- | --- | --- | --- | --- |
| charlie@company.com | 2025-12-01,02,03,04 | IN 09:00Z, OUT 17:00Z | 480 each | false | true |
| charlie@company.com | 2025-12-05 | IN 09:00Z, OUT 13:00Z | 240 | false | true |
| charlie@company.com | 2025-12-06,07,08,09,10 | none | 0 | true | true |
| lina@company.com | 2025-12-01..10 (all ten days) | IN 09:00Z, OUT 17:00Z | 480 each | false | true |

## 4) Fields Without Seed Values
- `_id`, timestamps auto-generated.
- AttendanceRecord fields beyond punches/totalWorkMinutes/flags remain default.

## 5) Enums & Status Coverage
- PunchPolicy: FIRST_LAST used.
- HolidayType: NATIONAL used.
- ShiftAssignmentStatus: APPROVED used.
- PunchType: IN, OUT used.

## 6) Validation Notes
- Employees (Charlie, Lina) must exist from Employee Profile seed.
- Shift references must point to the created Shift documents; shiftType references Morning Shift.
- Attendance dates/times are UTC ("Z").

## 7) Minimum Acceptance Checklist
- One shift type (Morning Shift) exists and active.
- Two shifts seeded with identical schedules as listed.
- Holiday for 2025-01-01 New Year present.
- Two shift assignments for Lina on 2025-12-01.
- Attendance records for Charlie (10 entries with described punches) and Lina (10 entries with full punches) exist and finalisedForPayroll=true.
