# Time Management Subsystem

## Models

### ShiftType

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Shift type name | Yes | Morning Shift; Night Shift |
| active | boolean | Active flag | Yes | true |

### Shift

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Shift name | Yes | Standard Morning (9-5); Standard Night (10-6) |
| shiftType | ObjectId | ShiftType ref | Yes | morningShiftType._id; nightShiftType._id |
| startTime | string | Start time | Yes | 09:00; 22:00 |
| endTime | string | End time | Yes | 17:00; 06:00 |
| punchPolicy | enum(PunchPolicy) | Punch policy | Yes | FIRST_LAST |
| graceInMinutes | number | Grace in minutes | Yes | 15 |
| graceOutMinutes | number | Grace out minutes | Yes | 15 |
| requiresApprovalForOvertime | boolean | Requires OT approval | Yes | true |
| active | boolean | Active flag | Yes | true |

### Holiday

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| type | enum(HolidayType) | Holiday type | Yes | NATIONAL |
| startDate | Date | Start date | Yes | 2025-01-01 |
| name | string | Holiday name | Yes | New Year |
| active | boolean | Active flag | Yes | true |
| endDate | Date | End date | No | Not found in seed files (defaults to startDate if missing) |

### LatenessRule

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Rule name | Yes | Standard Lateness |
| description | string | Description | No | Not found in seed files |
| gracePeriodMinutes | number | Grace period | Yes | 15 |
| deductionForEachMinute | number | Deduction per minute | Yes | 1 |
| active | boolean | Active flag | Yes | true |

### OvertimeRule

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Rule name | Yes | Standard Overtime |
| active | boolean | Active flag | Yes | true |
| approved | boolean | Approved flag | Yes | true |
| description | string | Description | No | Not found in seed files |

### ScheduleRule

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| name | string | Rule name | Yes | Standard Week |
| pattern | string | Pattern | Yes | Mon-Fri |
| active | boolean | Active flag | Yes | true |

### ShiftAssignment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| shiftId | ObjectId | Shift ref | Yes | standardMorningShift._id |
| startDate | Date | Start date | Yes | 2025-01-01 |
| status | enum(ShiftAssignmentStatus) | Assignment status | Yes | APPROVED |
| departmentId | ObjectId | Department ref | No | Not found in seed files |
| positionId | ObjectId | Position ref | No | Not found in seed files |
| scheduleRuleId | ObjectId | Schedule rule ref | No | Not found in seed files |
| endDate | Date | End date | No | Not found in seed files |

### AttendanceRecord

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| punches | Punch[] | Punch events | Yes | [{ type: IN, time: 2025-01-05T09:02:00Z }] |
| totalWorkMinutes | number | Total minutes | Yes | 0 |
| hasMissedPunch | boolean | Missed punch flag | Yes | true |
| exceptionIds | ObjectId[] | Linked exceptions | Yes | [timeException._id] (pushed after creation) |
| finalisedForPayroll | boolean | Finalised flag | Yes | false |

### AttendanceCorrectionRequest

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| attendanceRecord | ObjectId | Attendance record ref | Yes | attendanceRecord._id |
| reason | string | Correction reason | Yes | Forgot to punch out after client call |
| status | enum(CorrectionRequestStatus) | Request status | Yes | SUBMITTED |

### NotificationLog

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| to | ObjectId | Recipient | Yes | employees.bob._id |
| type | string | Notification type | Yes | AttendanceException |
| message | string | Message | Yes | Attendance exception created for Jan 6 shift. |

### TimeException

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeId | ObjectId | Employee ref | Yes | employees.bob._id |
| type | enum(TimeExceptionType) | Exception type | Yes | MISSED_PUNCH |
| attendanceRecordId | ObjectId | Attendance record ref | Yes | attendanceRecord._id |
| assignedTo | ObjectId | Assignee | Yes | employees.alice._id |
| status | enum(TimeExceptionStatus) | Status | Yes | OPEN |
| reason | string | Reason | Yes | Missing OUT punch on 6 Jan |

## Fields Without Seed Values

- Holiday: endDate.
- LatenessRule: description.
- OvertimeRule: description.
- ShiftAssignment: departmentId, positionId, scheduleRuleId, endDate.
- AttendanceRecord: none beyond listed seed values (finalisedForPayroll set to false).

## Seeding Summary

- Total models: 11
- Total seeded fields: 48
- Total non-seeded fields: 7
- Notes/assumptions: exceptionIds is populated via update after creating the related TimeException; timestamps are automatic.
