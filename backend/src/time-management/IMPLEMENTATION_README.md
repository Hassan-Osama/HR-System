# Time Management Backend - Implementation Guide

## ✅ Completed Implementation

### 1. DTOs Created (9 files)
All DTOs have been created in `src/time-management/dto/`:
- ✅ `create-shift-type.dto.ts` - Create new shift types
- ✅ `update-shift-type.dto.ts` - Update shift types
- ✅ `assign-shift.dto.ts` - Assign shifts to employees/departments/positions
- ✅ `update-shift.dto.ts` - Update shift assignments
- ✅ `update-shift-status.dto.ts` - Update shift status (PENDING/APPROVED/CANCELLED/EXPIRED)
- ✅ `create-schedule-rule.dto.ts` - Create scheduling rules
- ✅ `update-schedule-rule.dto.ts` - Update scheduling rules
- ✅ `create-holiday.dto.ts` - Create holidays
- ✅ `update-holiday.dto.ts` - Update holidays
- ✅ `index.ts` - Export all DTOs

### 2. Service Methods Implemented
All service methods in `time-management.service.ts`:

#### Shift Types (5 methods)
- ✅ `createShiftType(dto)` - Create new shift type
- ✅ `getShiftTypes()` - Get all shift types
- ✅ `getShiftTypeById(id)` - Get specific shift type
- ✅ `updateShiftType(id, dto)` - Update shift type
- ✅ `deleteShiftType(id)` - Delete shift type (with validation)

#### Shift Assignments (7 methods)
- ✅ `assignShift(dto)` - Assign shift to employee/department/position
- ✅ `getShifts(query)` - Get all shifts (with optional filters)
- ✅ `getShiftById(id)` - Get specific shift
- ✅ `getShiftsByEmployee(employeeId)` - Get employee's shifts
- ✅ `updateShift(id, dto)` - Update shift assignment
- ✅ `updateShiftStatus(id, dto)` - Update shift status
- ✅ `deleteShift(id)` - Delete shift assignment

#### Schedule Rules (5 methods)
- ✅ `createScheduleRule(dto)` - Create schedule rule
- ✅ `getScheduleRules()` - Get all schedule rules
- ✅ `getScheduleRuleById(id)` - Get specific rule
- ✅ `updateScheduleRule(id, dto)` - Update schedule rule
- ✅ `deleteScheduleRule(id)` - Delete schedule rule (with validation)

#### Holidays (5 methods)
- ✅ `createHoliday(dto)` - Create holiday
- ✅ `getHolidays()` - Get all holidays
- ✅ `getHolidayById(id)` - Get specific holiday
- ✅ `updateHoliday(id, dto)` - Update holiday
- ✅ `deleteHoliday(id)` - Delete holiday

#### Background Jobs (1 method)
- ✅ `checkExpiringShifts()` - Cron job that runs daily at 8 AM
  - Finds shifts expiring in next 7 days
  - Creates notification logs for HR Admins
  - Logs count of expiring shifts

### 3. Controller Endpoints Implemented
All endpoints in `time-management.controller.ts` with role-based access control:

#### Shift Types Endpoints
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/time-management/shift-types` | System Admin, HR Admin | Create shift type |
| GET | `/time-management/shift-types` | System Admin, HR Admin, HR Manager, HR Employee, Dept Head | List all shift types |
| GET | `/time-management/shift-types/:id` | System Admin, HR Admin, HR Manager, HR Employee, Dept Head | Get shift type |
| PATCH | `/time-management/shift-types/:id` | System Admin, HR Admin | Update shift type |
| DELETE | `/time-management/shift-types/:id` | System Admin only | Delete shift type |

#### Shift Assignment Endpoints
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/time-management/shifts/assign` | System Admin, HR Admin, HR Manager | Assign shift |
| GET | `/time-management/shifts` | System Admin, HR Admin, HR Manager, HR Employee, Dept Head | List shifts (filtered by role) |
| GET | `/time-management/shifts/:id` | All roles | Get shift details |
| GET | `/time-management/shifts/employee/:employeeId` | All roles (employees see only their own) | Get employee shifts |
| PATCH | `/time-management/shifts/:id` | System Admin, HR Admin, HR Manager | Update shift |
| PATCH | `/time-management/shifts/:id/status` | System Admin, HR Admin, HR Manager | Update shift status |
| DELETE | `/time-management/shifts/:id` | System Admin, HR Admin | Delete shift |

#### Schedule Rules Endpoints
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/time-management/schedule-rules` | System Admin, HR Admin | Create rule |
| GET | `/time-management/schedule-rules` | System Admin, HR Admin, HR Manager, HR Employee | List rules |
| GET | `/time-management/schedule-rules/:id` | System Admin, HR Admin, HR Manager, HR Employee | Get rule |
| PATCH | `/time-management/schedule-rules/:id` | System Admin, HR Admin | Update rule |
| DELETE | `/time-management/schedule-rules/:id` | System Admin only | Delete rule |

#### Holidays Endpoints
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/time-management/holidays` | System Admin, HR Admin | Create holiday |
| GET | `/time-management/holidays` | All authenticated users | List holidays |
| GET | `/time-management/holidays/:id` | All authenticated users | Get holiday |
| PATCH | `/time-management/holidays/:id` | System Admin, HR Admin | Update holiday |
| DELETE | `/time-management/holidays/:id` | System Admin, HR Admin | Delete holiday |

### 4. Security & Role-Based Access Control
- ✅ JWT Authentication required for all endpoints
- ✅ Role-based guards implemented
- ✅ Department Heads can only see their department's shifts
- ✅ Employees can only see their own shifts
- ✅ Validation prevents deletion of in-use resources
- ✅ Proper error handling with HTTP status codes

### 5. Module Configuration
- ✅ ScheduleModule added to app.module.ts for cron jobs
- ✅ All schemas registered in time-management.module.ts
- ✅ All dependencies injected

---

## 📦 Required Installation

Before running the application, install the schedule module:

```bash
cd backend
npm install @nestjs/schedule
```

---

## 🚀 How to Test

### 1. Start the Backend
```bash
cd backend
npm run start:dev
```

### 2. Test Endpoints Using Postman/curl

#### Login First (Get JWT Token)
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "ahmed.hassan@company.com",
  "password": "Password@EMP-ADMIN-001"
}
```

Copy the `accessToken` from response.

#### Create a Shift Type
```bash
POST http://localhost:3000/time-management/shift-types
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Normal 9-5 Shift",
  "active": true
}
```

#### Get All Shift Types
```bash
GET http://localhost:3000/time-management/shift-types
Authorization: Bearer <your-token>
```

#### Assign a Shift
```bash
POST http://localhost:3000/time-management/shifts/assign
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "employeeId": "507f1f77bcf86cd799439011",
  "shiftId": "507f1f77bcf86cd799439014",
  "startDate": "2025-12-10T00:00:00Z",
  "endDate": "2025-12-31T00:00:00Z",
  "status": "APPROVED"
}
```

#### Create a Schedule Rule
```bash
POST http://localhost:3000/time-management/schedule-rules
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Flexible Hours",
  "pattern": "Core hours 11 AM - 3 PM, flex-in 8-11 AM, flex-out 3-7 PM",
  "active": true
}
```

#### Create a Holiday
```bash
POST http://localhost:3000/time-management/holidays
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "type": "NATIONAL",
  "startDate": "2025-12-25T00:00:00Z",
  "name": "Christmas Day",
  "active": true
}
```

---

## 🔔 Cron Job - Shift Expiry Notification

### Configuration
- **Schedule**: Daily at 8:00 AM
- **Cron Expression**: `0 8 * * *`
- **Trigger**: Automatically runs every day

### What it does:
1. Finds all shifts with `status = APPROVED` and `endDate` within next 7 days
2. Creates notification log for each expiring shift
3. Notification includes: employee name, shift type, expiry date
4. Logs count of expiring shifts to console

### Manual Testing (for development):
To test the cron job immediately without waiting for 8 AM, you can temporarily change the cron expression in `time-management.service.ts`:

```typescript
// Original (runs at 8 AM daily)
@Cron('0 8 * * *')

// For testing (runs every minute)
@Cron('* * * * *')
```

**Remember to change it back after testing!**

---

## 📊 Database Collections Used

The implementation uses these MongoDB collections:
- ✅ `shift_types` - Different types of shifts (Normal, Split, Overnight, etc.)
- ✅ `shift_assignments` - Assigned shifts to employees/departments/positions
- ✅ `schedule_rules` - Custom scheduling patterns
- ✅ `holidays` - National, organizational, and weekly holidays
- ✅ `notification_logs` - Notifications for expiring shifts

---

## 🔒 Security Features

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Role-based access control on all endpoints
3. **Data Filtering**: Department Heads see only their department
4. **Privacy**: Employees see only their own data
5. **Validation**: Prevents deletion of resources in use
6. **Error Handling**: Proper HTTP status codes (404, 400, 401, 403)

---

## 📝 Example Workflows

### Workflow 1: System Admin Creates and Assigns Shift

```
1. Login as System Admin
   POST /auth/login

2. Create Shift Type
   POST /time-management/shift-types
   { "name": "12-Hour Rotating Shift", "active": true }

3. Assign to Nursing Department
   POST /time-management/shifts/assign
   {
     "departmentId": "dept-123",
     "shiftId": "shift-456",
     "startDate": "2025-12-10",
     "endDate": "2026-12-10",
     "status": "APPROVED"
   }

4. Check expiring shifts (auto-run daily at 8 AM)
   Cron job creates notification 7 days before expiry
```

### Workflow 2: HR Admin Manages Schedule Rules

```
1. Login as HR Admin
   POST /auth/login

2. Create Flexible Schedule Rule
   POST /time-management/schedule-rules
   {
     "name": "4-Day Work Week",
     "pattern": "Mon-Thu (10 hours/day), Fri-Sun off",
     "active": true
   }

3. Assign shifts using this rule
   POST /time-management/shifts/assign
   {
     "positionId": "pos-789",
     "shiftId": "shift-456",
     "scheduleRuleId": "rule-123",
     "startDate": "2025-12-10",
     "status": "PENDING"
   }

4. Approve the shift
   PATCH /time-management/shifts/{id}/status
   { "status": "APPROVED" }
```

### Workflow 3: Department Head Views Team Shifts

```
1. Login as Department Head
   POST /auth/login

2. View shifts (automatically filtered to their department)
   GET /time-management/shifts
   Returns only shifts for their department

3. View specific employee's shifts
   GET /time-management/shifts/employee/{employeeId}
```

---

## ✅ Implementation Checklist

- [x] Create all 9 DTO files
- [x] Export DTOs in index.ts
- [x] Implement 22 service methods
- [x] Create 19 controller endpoints
- [x] Add role-based access control
- [x] Implement cron job for shift expiry
- [x] Add validation and error handling
- [x] Configure ScheduleModule
- [x] Update app.module.ts
- [x] Add Swagger documentation
- [ ] Install @nestjs/schedule package (run: `npm install @nestjs/schedule`)
- [ ] Test all endpoints
- [ ] Test cron job
- [ ] Deploy to production

---

## 🎯 Next Steps

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install @nestjs/schedule
   ```

2. **Start Backend**:
   ```bash
   npm run start:dev
   ```

3. **Test Endpoints**: Use Postman or curl to test all endpoints

4. **Monitor Cron Job**: Check console logs daily at 8 AM for expiring shift notifications

5. **Frontend Integration**: Create UI components for:
   - Shift type management
   - Shift assignment dashboard
   - Schedule rule configuration
   - Holiday calendar
   - Expiring shifts notifications

---

## 📚 API Documentation

Once the server is running, view the complete API documentation at:
```
http://localhost:3000/api
```

(Swagger/OpenAPI documentation auto-generated from decorators)

---

## 🐛 Troubleshooting

### Issue: Cron job not running
- **Solution**: Verify ScheduleModule is imported in app.module.ts
- **Check**: Install @nestjs/schedule: `npm install @nestjs/schedule`

### Issue: "Unauthorized" error
- **Solution**: Include JWT token in Authorization header
- **Format**: `Authorization: Bearer <your-token>`

### Issue: "Shift type in use, cannot delete"
- **Solution**: Remove all shift assignments using this type first
- **Alternative**: Mark as inactive instead of deleting

### Issue: Department Head sees all shifts
- **Solution**: Ensure user object includes `departmentId` in JWT payload
- **Check**: Verify RolesGuard is properly applied

---

**Implementation Status**: ✅ **100% Complete**
**Ready for**: Testing & Frontend Integration
