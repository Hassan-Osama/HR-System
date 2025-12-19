# Organization Structure Subsystem

## Models

### Department

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| code | string | Department code | Yes | HR-001; ENG-001; SALES-001 |
| name | string | Department name | Yes | Human Resources; Engineering; Sales |
| description | string | Description | Yes | Handles all HR related tasks; Software Development and Engineering; Sales and Marketing |
| isActive | boolean | Active flag | Yes | true |
| headPositionId | ObjectId | Head position ref | No | Not found in seed files |

### Position

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| code | string | Position code | Yes | POS-HR-MGR; POS-HR-GEN; POS-SWE; POS-QA-ENG; POS-SALES-REP; POS-SALES-LEAD |
| title | string | Title | Yes | HR Manager; HR Generalist; Software Engineer; QA Engineer; Sales Representative; Sales Lead |
| description | string | Description | Yes | Manager of Human Resources; HR operations and employee relations; Full Stack Developer; Quality assurance and testing; Sales Representative; Leads sales team for regional accounts |
| departmentId | ObjectId | Department ref | Yes | hrDept._id (POS-HR-MGR, POS-HR-GEN); engDept._id (POS-SWE, POS-QA-ENG); salesDept._id (POS-SALES-REP, POS-SALES-LEAD) |
| isActive | boolean | Active flag | Yes | true |
| reportsToPositionId | ObjectId | Reporting position | No | Not found in seed files (auto-resolved pre-save) |

### PositionAssignment

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| employeeProfileId | ObjectId | Employee ref | Yes | alice._id; bob._id; charlie._id |
| positionId | ObjectId | Position ref | Yes | hrManagerPos._id; softwareEngPos._id; salesRepPos._id |
| departmentId | ObjectId | Department ref | Yes | hrDept._id; engDept._id; salesDept._id |
| startDate | Date | Assignment start | Yes | 2020-01-01; 2021-05-15; 2022-03-10 |
| endDate | Date | Assignment end | No | Not found in seed files |
| changeRequestId | ObjectId | Related change request | No | Not found in seed files |
| reason | string | Reason | No | Not found in seed files |
| notes | string | Notes | No | Not found in seed files |

### StructureChangeRequest

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| _id | ObjectId | Request id | Yes | Generated ObjectId |
| requestNumber | string | Request number | Yes | SCR-2025-001 |
| requestedByEmployeeId | ObjectId | Requestor | Yes | employees.alice._id |
| requestType | enum(StructureRequestType) | Request type | Yes | NEW_POSITION |
| targetDepartmentId | ObjectId | Target department | Yes | departments.salesDept._id |
| details | string | Details | Yes | Create a Sales Lead position to manage regional reps. |
| reason | string | Reason | Yes | Sales expansion |
| status | enum(StructureRequestStatus) | Status | Yes | SUBMITTED |
| submittedByEmployeeId | ObjectId | Submitted by | Yes | employees.alice._id |
| submittedAt | Date | Submission time | Yes | 2025-02-01 |
| targetPositionId | ObjectId | Target position | No | Not found in seed files |

### StructureApproval

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| _id | ObjectId | Approval id | Yes | Generated ObjectId |
| changeRequestId | ObjectId | Linked request | Yes | salesLeadRequest._id |
| approverEmployeeId | ObjectId | Approver | Yes | employees.bob._id |
| decision | enum(ApprovalDecision) | Decision | Yes | PENDING |
| comments | string | Comments | Yes | Pending finance alignment |
| decidedAt | Date | Decision time | No | Not found in seed files |

### StructureChangeLog

| Field | Type | Description | Seeded? | Seed Value(s) |
| --- | --- | --- | --- | --- |
| _id | ObjectId | Log id | Yes | Generated ObjectId |
| action | enum(ChangeLogAction) | Action | Yes | CREATED |
| entityType | string | Entity type | Yes | Position |
| entityId | ObjectId | Entity id | Yes | positions.salesRepPos._id |
| performedByEmployeeId | ObjectId | Actor | Yes | employees.alice._id |
| summary | string | Summary | Yes | Requested upgrade for Sales Representative track |
| beforeSnapshot | object | Before state | Yes | { title: 'Sales Representative', departmentId: salesDept._id } |
| afterSnapshot | object | After state | Yes | { title: 'Sales Lead', departmentId: salesDept._id } |

## Fields Without Seed Values

- Department: headPositionId.
- Position: reportsToPositionId (auto-resolved when a head is set).
- PositionAssignment: endDate, changeRequestId, reason, notes.
- StructureChangeRequest: targetPositionId.
- StructureApproval: decidedAt.

## Seeding Summary

- Total models: 6
- Total seeded fields: 40
- Total non-seeded fields: 8
- Notes/assumptions: ObjectIds are generated at insert time; timestamps (`createdAt`, `updatedAt`) are automatic.
