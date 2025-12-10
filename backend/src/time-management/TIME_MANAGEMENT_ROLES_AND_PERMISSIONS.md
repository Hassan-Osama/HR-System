# Time Management System - Roles & Permissions Guide

## System Roles Overview
1. **System Admin** - Full system access
2. **HR Admin** - HR operations and approvals
3. **HR Manager** - Strategic HR management
4. **HR Employee** - HR support tasks
5. **Department Head** - Team management
6. **Department Employee** - Self-service only

---

## Story 1: Shift Assignment Management

### What it does:
Assigns work shifts to employees and manages their lifecycle (approval, cancellation, expiry).

### Role Permissions:

#### **System Admin** - FULL ACCESS
- ✅ Assign shifts to ANY employee
- ✅ Assign shifts by department
- ✅ Assign shifts by position
- ✅ View all shifts across organization
- ✅ Update any shift
- ✅ Change shift status (Approved → Cancelled, etc.)
- ✅ Delete any shift
- ✅ Override any restrictions

**Example Use Case:**
```
System Admin Sarah needs to reassign night shifts for the Security Department 
during a special event:
1. Assigns OVERNIGHT shift to all "Security Guard" positions
2. Sets duration: Dec 25-31, 2025
3. Status: Approved (immediate effect)
4. Can cancel if event gets postponed
```

---

#### **HR Admin** - OPERATIONAL ACCESS
- ✅ Assign shifts to employees (individual/department/position)
- ✅ View all shifts in organization
- ✅ Update shifts for approval workflow
- ✅ Approve/Reject pending shifts
- ✅ Cancel approved shifts
- ✅ Mark shifts as Expired
- ❌ Cannot delete shifts (audit trail)

**Example Use Case:**
```
HR Admin Ahmed receives shift request from IT Manager:
1. Creates shift assignment for "Backend Developers" position
2. Shift Type: ROTATIONAL (2 weeks day shift, 2 weeks night shift)
3. Duration: Jan 1 - Dec 31, 2026
4. Status: PENDING → Reviews with manager → Sets to APPROVED
5. Gets notification when shift is expiring (Story 4)
```

---

#### **HR Manager** - STRATEGIC ACCESS
- ✅ View all shifts
- ✅ Assign shifts to departments/positions (strategic planning)
- ✅ Approve/Reject shift assignments
- ✅ Update shift configurations
- ❌ Cannot directly cancel (must go through HR Admin)
- ❌ Cannot delete

**Example Use Case:**
```
HR Manager Fatma plans quarterly shift rotation:
1. Views current shift assignments dashboard
2. Assigns new SPLIT shift pattern to Customer Service department
3. Morning: 8 AM - 2 PM, Evening: 2 PM - 8 PM
4. Reviews and approves pending shift changes
5. Monitors shift compliance reports
```

---

#### **Department Head** - TEAM ACCESS
- ✅ View shifts for their department only
- ✅ Request shift assignments for their team
- ✅ View shift status for their employees
- ❌ Cannot approve (must request from HR)
- ❌ Cannot assign directly
- ❌ Cannot cancel approved shifts

**Example Use Case:**
```
Department Head Mohamed (Sales Manager) needs to adjust team schedule:
1. Views current shifts for Sales team
2. Requests new shift for 3 sales reps: FLEXIBLE (Flex-in/Flex-out)
3. Submits request to HR Admin
4. Receives notification when approved
5. Can view which employees are on which shifts
```

---

#### **Department Employee** - SELF-SERVICE ONLY
- ✅ View their own assigned shifts
- ✅ Check shift schedule/calendar
- ✅ View shift details (type, hours, dates)
- ❌ Cannot modify anything
- ❌ Cannot request shift changes (must go through manager)

**Example Use Case:**
```
Employee Layla (Customer Service Rep) checks her schedule:
1. Logs in and views "My Shifts"
2. Sees assigned ROTATIONAL shift: Week 1-2 Day, Week 3-4 Night
3. Views calendar with shift timings
4. Receives notification if shift is about to expire
```

---

## Story 2: Shift Type Configuration

### What it does:
Define and manage different types of work shifts (Normal, Split, Overnight, Rotational, Flexible).

### Role Permissions:

#### **System Admin** - FULL ACCESS
- ✅ Create new shift types
- ✅ Update any shift type
- ✅ Delete shift types (if not in use)
- ✅ Define shift parameters (start time, end time, break duration, etc.)
- ✅ Set shift type as active/inactive

**Example Use Case:**
```
System Admin creates new shift type for hospital staff:
Shift Type: "12-HOUR_ROTATING"
- Duration: 12 hours
- Pattern: 3 days on, 4 days off
- Breaks: 2 x 30 min breaks
- Applicable to: Nursing Staff, Doctors
- Status: Active
```

---

#### **HR Admin** - OPERATIONAL ACCESS
- ✅ Create shift types
- ✅ Update shift types
- ✅ View all shift types
- ❌ Cannot delete (must request System Admin)
- ❌ Cannot deactivate system-critical types

**Example Use Case:**
```
HR Admin creates shift for manufacturing plant:
Shift Type: "TRIPLE_SHIFT"
- Morning Shift: 6 AM - 2 PM
- Evening Shift: 2 PM - 10 PM
- Night Shift: 10 PM - 6 AM
- Break: 30 min lunch + 15 min tea
- Applicable to: Production Department
```

---

#### **HR Manager** - VIEW & STRATEGIC PLANNING
- ✅ View all shift types
- ✅ Suggest new shift types (requests to HR Admin)
- ✅ View usage statistics
- ❌ Cannot create/edit directly
- ❌ Cannot delete

**Example Use Case:**
```
HR Manager analyzes shift efficiency:
1. Views report: "NORMAL" shift used by 60% employees
2. Sees "FLEXIBLE" shift improves satisfaction by 25%
3. Recommends expanding FLEXIBLE to more departments
4. Requests HR Admin to create new hybrid shift type
```

---

#### **Department Head** - VIEW ONLY (Applicable Types)
- ✅ View shift types available for their department
- ✅ See shift type details
- ❌ Cannot create/edit/delete
- ❌ Cannot request new types

**Example Use Case:**
```
Department Head views available shifts for IT team:
- NORMAL: 9 AM - 5 PM
- FLEXIBLE: Core hours 11 AM - 3 PM, flex 5 hours
- ROTATIONAL: Weekly rotation (day/night)
Uses this info to plan team schedule requests.
```

---

## Story 3: Custom Scheduling Rules

### What it does:
Define flexible rules like flex-time hours, custom weekly patterns (4 days on/3 off, etc.).

### Role Permissions:

#### **System Admin** - FULL ACCESS
- ✅ Create any scheduling rule
- ✅ Update any rule
- ✅ Delete rules
- ✅ Set organization-wide defaults
- ✅ Override department rules

**Example Use Case:**
```
System Admin creates company-wide flex policy:
Rule: "CORPORATE_FLEX_POLICY"
- Core Hours: 11 AM - 3 PM (mandatory)
- Flex Window: 8 AM - 11 AM (flex-in), 3 PM - 7 PM (flex-out)
- Required Hours: 8 hours/day
- Applicable to: All departments except Security & Manufacturing
- Effective Date: Jan 1, 2026
```

---

#### **HR Admin** - OPERATIONAL ACCESS
- ✅ Create scheduling rules
- ✅ Update rules
- ✅ Assign rules to departments/positions
- ❌ Cannot override organization-wide rules
- ❌ Cannot delete rules affecting multiple departments

**Example Use Case:**
```
HR Admin creates rule for customer service team:
Rule: "CS_WEEKEND_PATTERN"
- Pattern: 4 days on (Thu-Sun), 3 days off (Mon-Wed)
- Shift: 10 AM - 8 PM
- Rotation: Every 4 weeks
- Applicable to: Customer Service Department
- Compensatory Days: +2 days annual leave
```

---

#### **HR Manager** - STRATEGIC PLANNING
- ✅ View all scheduling rules
- ✅ Propose new rules
- ✅ Analyze rule effectiveness
- ❌ Cannot create directly
- ❌ Cannot edit existing rules

**Example Use Case:**
```
HR Manager proposes compressed work week:
Analyzes data and suggests:
Rule: "4-DAY_WORK_WEEK_PILOT"
- Pattern: Mon-Thu (10 hours/day)
- Friday: Off
- Trial Period: 6 months
- Target: IT & Marketing departments
Submits proposal to System Admin for approval.
```

---

## Story 4: Shift Expiry Notifications

### What it does:
Automatically notify HR when shifts are about to expire so they can renew/reassign.

### Role Permissions:

#### **System Admin** - CONFIGURATION
- ✅ Configure notification settings
- ✅ Set expiry warning period (default: 7 days)
- ✅ Define who receives notifications
- ✅ Enable/disable auto-notifications

**Example Use Case:**
```
System Admin configures expiry alerts:
- Warning Period: 7 days before expiry
- Recipients: All HR Admins + System Admins
- Frequency: Daily digest at 8 AM
- Include: Employee name, shift type, expiry date, manager to contact
```

---

#### **HR Admin** - RECEIVES & ACTS
- ✅ Receive shift expiry notifications
- ✅ View expiring shifts dashboard
- ✅ Renew shifts
- ✅ Reassign shifts
- ✅ Mark as "Will Expire" (intentional)

**Example Use Case:**
```
HR Admin receives notification:
"EXPIRING SHIFTS - 7 Days Alert"
- Employee: Ahmed Hassan (EMP-IT-001)
- Shift: ROTATIONAL Night Shift
- Expires: Dec 16, 2025
- Manager: Mohamed Ali (IT Dept Head)

Actions taken:
1. Contacts manager: "Renew or change shift?"
2. Manager confirms: "Switch to NORMAL day shift"
3. HR Admin creates new shift assignment
4. Old shift marked as "Will Expire Naturally"
```

---

#### **HR Manager** - OVERSIGHT
- ✅ View expiry reports
- ✅ Monitor renewal rates
- ✅ Escalate overdue renewals
- ❌ Does not receive individual notifications (gets weekly summary)

---

#### **Department Head** - INFORMATIONAL
- ✅ Receive FYI notifications for their team
- ✅ Provide input on renewals
- ❌ Cannot renew shifts directly

**Example Use Case:**
```
Department Head receives weekly summary:
"Your Team - Shift Renewals Needed"
- 3 employees: shifts expiring in 2 weeks
- 1 employee: shift expired (not renewed yet)

Department Head contacts HR Admin with preferences.
```

---

## Story 14: Holiday Configuration

### What it does:
Define organizational holidays (national, religious, company-specific) that affect attendance.

### Role Permissions:

#### **System Admin** - FULL ACCESS
- ✅ Create holidays
- ✅ Update holidays
- ✅ Delete holidays
- ✅ Set holiday types (NATIONAL, RELIGIOUS, COMPANY)
- ✅ Define compensation rules (paid/unpaid)

**Example Use Case:**
```
System Admin creates annual holiday calendar:
1. National Day (Dec 2) - PAID, All employees
2. New Year (Jan 1) - PAID, All employees
3. Eid Al-Fitr (Varies) - PAID, Muslim employees
4. Company Anniversary (Mar 15) - PAID, All employees
5. Ramadan (Flexible) - FLEXIBLE hours for Muslim employees
```

---

#### **HR Admin** - OPERATIONAL ACCESS
- ✅ Create holidays
- ✅ Update holiday details
- ✅ Assign holidays to departments
- ❌ Cannot delete national holidays
- ❌ Cannot change paid/unpaid status (System Admin only)

**Example Use Case:**
```
HR Admin adds regional holiday:
Holiday: "Alexandria Founding Day"
- Date: July 20
- Type: REGIONAL
- Applicable: Alexandria Branch only
- Status: PAID
- Affects: 50 employees in Alexandria office
```

---

#### **HR Manager** - STRATEGIC PLANNING
- ✅ View holiday calendar
- ✅ Suggest holidays
- ✅ Analyze holiday impact on productivity
- ❌ Cannot create/edit directly

**Example Use Case:**
```
HR Manager reviews holiday impact:
1. Analyzes: National holidays cause 12 days off/year
2. Company holidays: 3 days
3. Floating holidays: 2 days (employee choice)
4. Recommends adding 1 wellness day
5. Submits proposal to System Admin
```

---

## Complete Access Matrix

| Feature | System Admin | HR Admin | HR Manager | Dept Head | Employee |
|---------|-------------|----------|------------|-----------|----------|
| **Shift Assignment** |
| Assign Shifts | ✅ All | ✅ All | ✅ Strategic | ❌ Request Only | ❌ |
| Approve Shifts | ✅ | ✅ | ✅ | ❌ | ❌ |
| Cancel Shifts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Shifts | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Shifts | ✅ All | ✅ All | ✅ All | ✅ Dept Only | ✅ Self Only |
| **Shift Types** |
| Create Types | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Types | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Types | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Schedule Rules** |
| Create Rules | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Rules | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Rules | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Holidays** |
| Create Holidays | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Holidays | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Holidays | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Notifications** |
| Configure | ✅ | ❌ | ❌ | ❌ | ❌ |
| Receive Alerts | ✅ | ✅ | Weekly Summary | FYI Only | ❌ |

---

## Real-World Examples by Industry

### Example 1: Hospital (Healthcare)
```
System Admin: Creates 12-hour shift types for nurses
HR Admin: Assigns rotating shifts to nursing staff
HR Manager: Monitors overtime and burnout metrics
Dept Head (Nursing): Requests shift changes for maternity ward
Employee (Nurse): Views personal schedule, checks days off
```

### Example 2: Call Center
```
System Admin: Sets up flexible scheduling rules (flex-in/out)
HR Admin: Assigns split shifts (morning/evening) to agents
HR Manager: Analyzes peak hours, adjusts shift coverage
Dept Head (CS Manager): Views team coverage, requests weekend shifts
Employee (Agent): Checks shift times, plans personal schedule
```

### Example 3: Manufacturing Plant
```
System Admin: Creates 3-shift rotation (morning/evening/night)
HR Admin: Assigns shifts to production line workers
HR Manager: Reviews shift efficiency, proposes 4-day work week
Dept Head (Production): Monitors shift attendance, requests overtime
Employee (Worker): Views current shift assignment, gets expiry alerts
```

---

## Implementation Priority

1. **Phase 1 (Essential):**
   - Story 2: Shift Types (Foundation)
   - Story 1: Shift Assignments (Core feature)
   
2. **Phase 2 (Important):**
   - Story 14: Holidays (Required for attendance)
   - Story 4: Expiry Notifications (Automation)
   
3. **Phase 3 (Advanced):**
   - Story 3: Custom Rules (Flexibility)

---

## Security & Audit Considerations

- **All actions must be logged** with user, timestamp, and reason
- **Shifts cannot be deleted**, only cancelled/expired (audit trail)
- **Department Heads can only see their own team** (data privacy)
- **Employees cannot see other employees' shifts** (privacy)
- **HR Admin actions require reason** when cancelling/changing shifts

---

**Questions to ask before implementing:**
1. Should Department Heads be able to approve their own team's shifts?
2. Should there be a "Shift Manager" role separate from Department Head?
3. Should employees be able to request shift changes or swaps?
4. Should there be an approval workflow for shift assignments?
5. What happens to shifts when an employee leaves or changes department?
