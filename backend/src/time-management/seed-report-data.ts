/**
 * Interactive Seed Script for Time Management Reports
 * Run with: npm run build && node dist/time-management/seed-report-data.js
 * 
 * Features:
 *   - Interactive prompts to select department and employee type
 *   - Shows available options before asking for selection
 *   - Generates attendance records with lateness, overtime, and missed punches
 *   - Creates time exceptions with realistic reasons
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as readline from 'readline';

// Create readline interface for user input
function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

// Prompt user for input
function prompt(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function seedReportData() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const AttendanceRecord = app.get(getModelToken('AttendanceRecord'));
    const TimeException = app.get(getModelToken('TimeException'));
    const EmployeeProfile = app.get(getModelToken('EmployeeProfile'));
    const Department = app.get(getModelToken('Department'));

    const rl = createReadlineInterface();

    console.log('\n' + '='.repeat(60));
    console.log('� INTERACTIVE TIME MANAGEMENT DATA SEEDER');
    console.log('='.repeat(60));

    // ==================== DEPARTMENTS ====================
    console.log('\n📂 AVAILABLE DEPARTMENTS:');
    console.log('-'.repeat(40));

    const departments = await Department.find({}).select('_id name').lean();

    if (departments.length === 0) {
        console.log('   ⚠️  No departments found in database');
    } else {
        console.log('   [0] All Departments');
        departments.forEach((dept: any, index: number) => {
            console.log(`   [${index + 1}] ${dept.name}`);
        });
    }

    let selectedDepartment: any = null;
    const deptChoice = await prompt(rl, '\n👉 Enter department number (0 for all, or press Enter for all): ');

    if (deptChoice && parseInt(deptChoice) > 0 && parseInt(deptChoice) <= departments.length) {
        selectedDepartment = departments[parseInt(deptChoice) - 1];
        console.log(`   ✅ Selected: ${selectedDepartment.name}`);
    } else {
        console.log('   ✅ Selected: All Departments');
    }

    // ==================== EMPLOYEE TYPES ====================
    console.log('\n👥 AVAILABLE EMPLOYEE TYPES:');
    console.log('-'.repeat(40));

    // Get distinct contract types from database
    const employeeTypes = await EmployeeProfile.distinct('contractType');
    const validTypes = employeeTypes.filter((t: any) => t !== null && t !== undefined && t !== '');

    // Add common types that might not exist yet
    const allPossibleTypes = [
        'FULL_TIME',
        'PART_TIME',
        'CONTRACT',
        'INTERN',
        'PROBATION',
        'FULL_TIME_CONTRACT',
        ...validTypes
    ];
    // Remove duplicates
    const uniqueTypes = [...new Set(allPossibleTypes)];

    console.log('   [0] All Employee Types');
    uniqueTypes.forEach((type: string, index: number) => {
        const count = employeeTypes.includes(type) ? '(exists in DB)' : '(no employees yet)';
        console.log(`   [${index + 1}] ${type} ${count}`);
    });

    let selectedType: string | null = null;
    const typeChoice = await prompt(rl, '\n👉 Enter employee type number (0 for all, or press Enter for all): ');

    if (typeChoice && parseInt(typeChoice) > 0 && parseInt(typeChoice) <= uniqueTypes.length) {
        selectedType = uniqueTypes[parseInt(typeChoice) - 1];
        console.log(`   ✅ Selected: ${selectedType}`);
    } else {
        console.log('   ✅ Selected: All Employee Types');
    }

    // ==================== EXCEPTION COUNT ====================
    console.log('\n🚨 EXCEPTION GENERATION:');
    console.log('-'.repeat(40));

    const exceptionCountInput = await prompt(rl, '👉 How many exceptions to generate? (default: 20): ');
    const exceptionCount = parseInt(exceptionCountInput) || 20;
    console.log(`   ✅ Will generate: ${exceptionCount} exceptions`);

    // ==================== DAYS OF DATA ====================
    const daysInput = await prompt(rl, '👉 How many days of attendance data? (default: 30): ');
    const daysCount = parseInt(daysInput) || 30;
    console.log(`   ✅ Will cover: ${daysCount} days`);

    rl.close();

    // ==================== BUILD QUERY ====================
    console.log('\n' + '='.repeat(60));
    console.log('📊 GENERATING DATA...');
    console.log('='.repeat(60));

    const employeeQuery: any = { status: 'ACTIVE' };

    if (selectedDepartment) {
        employeeQuery.primaryDepartmentId = new Types.ObjectId(selectedDepartment._id);
    }

    if (selectedType) {
        employeeQuery.contractType = selectedType;
    }

    // ==================== FETCH EMPLOYEES ====================
    console.log('\n🔍 Fetching employees...');
    const employees = await EmployeeProfile.find(employeeQuery)
        .populate('primaryDepartmentId', 'name')
        .limit(30);

    if (employees.length === 0) {
        console.log('\n❌ No employees found matching criteria!');
        console.log('   Try selecting different filters or ensure employees exist in the database.');
        await app.close();
        return;
    }

    console.log(`✅ Found ${employees.length} employees:\n`);
    employees.forEach((emp: any, index: number) => {
        const name = emp.fullName || `${emp.firstName} ${emp.lastName}`;
        const type = emp.contractType || 'NOT_SET';
        const dept = emp.primaryDepartmentId?.name || 'Unassigned';
        console.log(`   ${index + 1}. ${name}`);
        console.log(`      Type: ${type} | Department: ${dept}`);
    });

    // ==================== GENERATE DATES ====================
    const dates: Date[] = [];
    for (let i = 0; i < daysCount; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
    }

    let attendanceCreated = 0;
    let attendanceUpdated = 0;
    let exceptionsCreated = 0;

    console.log('\n📋 Processing attendance records...');

    // ==================== CREATE/UPDATE ATTENDANCE ====================
    for (const employee of employees) {
        const recordDays = dates.filter(() => Math.random() > 0.25); // 75% attendance rate

        for (const date of recordDays) {
            const existingRecord = await AttendanceRecord.findOne({
                employeeId: employee._id,
                date: date,
            });

            if (existingRecord) {
                const workMinutes = Math.floor(Math.random() * 200) + 400;
                const isLate = Math.random() > 0.55; // 45% chance of being late
                const lateMinutes = isLate ? Math.floor(Math.random() * 45) + 5 : 0;
                const hasMissedPunch = Math.random() > 0.82; // 18% chance

                await AttendanceRecord.updateOne(
                    { _id: existingRecord._id },
                    {
                        $set: {
                            totalWorkMinutes: workMinutes,
                            isLate: isLate,
                            lateMinutes: lateMinutes,
                            hasMissedPunch: hasMissedPunch,
                        }
                    }
                );
                attendanceUpdated++;
                continue;
            }

            const clockInHour = 8 + Math.floor(Math.random() * 2);
            const clockInMinute = Math.floor(Math.random() * 60);
            const workMinutes = Math.floor(Math.random() * 200) + 400;

            const clockInTime = new Date(date);
            clockInTime.setHours(clockInHour, clockInMinute, 0, 0);

            const clockOutTime = new Date(clockInTime);
            clockOutTime.setMinutes(clockOutTime.getMinutes() + workMinutes);

            const expectedStart = new Date(date);
            expectedStart.setHours(9, 0, 0, 0);
            let isLate = clockInTime > expectedStart;
            let lateMinutes = 0;
            if (isLate) {
                lateMinutes = Math.round((clockInTime.getTime() - expectedStart.getTime()) / 60000);
            }

            if (Math.random() > 0.55) {
                isLate = true;
                lateMinutes = Math.floor(Math.random() * 45) + 5;
            }

            const hasMissedPunch = Math.random() > 0.82;

            const record = new AttendanceRecord({
                employeeId: employee._id,
                date: date,
                punches: [
                    { type: 'IN', time: clockInTime },
                    { type: 'OUT', time: clockOutTime },
                ],
                totalWorkMinutes: workMinutes,
                isLate: isLate,
                lateMinutes: lateMinutes,
                hasMissedPunch: hasMissedPunch,
                finalisedForPayroll: false,
            });

            await record.save();
            attendanceCreated++;
        }
    }

    console.log(`   ✅ Attendance created: ${attendanceCreated}`);
    console.log(`   ✅ Attendance updated: ${attendanceUpdated}`);

    // ==================== GENERATE EXCEPTIONS ====================
    console.log(`\n🚨 Generating ${exceptionCount} time exceptions...`);

    const exceptionTypes = [
        'MISSED_PUNCH',
        'LATE',
        'EARLY_LEAVE',
        'REPEATED_LATENESS',
        'OVERTIME_REQUEST',
        'SHORT_TIME',
        'UNAUTHORIZED_ABSENCE'
    ];
    const exceptionStatuses = ['OPEN', 'PENDING', 'RESOLVED', 'ESCALATED', 'APPROVED', 'REJECTED'];

    const attendanceRecordsForExceptions = await AttendanceRecord.find({
        employeeId: { $in: employees.map((e: any) => e._id) },
        date: { $gte: dates[dates.length - 1], $lte: dates[0] }
    }).populate('employeeId', 'fullName firstName lastName');

    const shuffledRecords = attendanceRecordsForExceptions.sort(() => Math.random() - 0.5);
    const recordsForExceptions = shuffledRecords.slice(0, Math.min(exceptionCount, shuffledRecords.length));

    for (const record of recordsForExceptions) {
        const exceptionType = exceptionTypes[Math.floor(Math.random() * exceptionTypes.length)];
        const exceptionStatus = exceptionStatuses[Math.floor(Math.random() * exceptionStatuses.length)];

        const existingException = await TimeException.findOne({
            attendanceRecordId: record._id,
            type: exceptionType,
        });

        if (existingException) {
            continue;
        }

        const exception = new TimeException({
            employeeId: record.employeeId._id || record.employeeId,
            attendanceRecordId: record._id,
            type: exceptionType,
            status: exceptionStatus,
            assignedTo: record.employeeId._id || record.employeeId,
            reason: getExceptionReason(exceptionType),
        });

        await exception.save();
        exceptionsCreated++;

        const empName = (record.employeeId as any)?.fullName ||
            `${(record.employeeId as any)?.firstName} ${(record.employeeId as any)?.lastName}`;
        console.log(`   ✅ ${exceptionType} (${exceptionStatus}) - ${empName}`);
    }

    // ==================== FINAL SUMMARY ====================
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING COMPLETE');
    console.log('='.repeat(60));

    const totalAttendance = await AttendanceRecord.countDocuments({});
    const lateRecords = await AttendanceRecord.countDocuments({ isLate: true });
    const overtimeRecords = await AttendanceRecord.countDocuments({ totalWorkMinutes: { $gt: 480 } });
    const missedPunchRecords = await AttendanceRecord.countDocuments({ hasMissedPunch: true });
    const totalExceptions = await TimeException.countDocuments({});

    console.log('\n📈 THIS SESSION:');
    console.log(`   Attendance created: ${attendanceCreated}`);
    console.log(`   Attendance updated: ${attendanceUpdated}`);
    console.log(`   Exceptions created: ${exceptionsCreated}`);

    console.log('\n📈 DATABASE TOTALS:');
    console.log(`   Total attendance records: ${totalAttendance}`);
    console.log(`   Late records (isLate=true): ${lateRecords}`);
    console.log(`   Overtime records (>8h): ${overtimeRecords}`);
    console.log(`   Missed punch records: ${missedPunchRecords}`);
    console.log(`   Total time exceptions: ${totalExceptions}`);

    console.log('\n🚨 EXCEPTIONS BY TYPE:');
    for (const type of exceptionTypes) {
        const count = await TimeException.countDocuments({ type });
        if (count > 0) {
            console.log(`   ${type}: ${count}`);
        }
    }

    console.log('\n📋 EXCEPTIONS BY STATUS:');
    for (const status of exceptionStatuses) {
        const count = await TimeException.countDocuments({ status });
        if (count > 0) {
            console.log(`   ${status}: ${count}`);
        }
    }

    await app.close();
    console.log('\n✅ Done! Your reports should now display data.\n');
}

function getExceptionReason(type: string): string {
    const reasons: Record<string, string[]> = {
        'MISSED_PUNCH': [
            'Forgot to punch out before leaving',
            'System was not working at clock-out time',
            'Left for emergency without punching out',
            'Badge reader malfunction',
        ],
        'LATE': [
            'Traffic congestion on commute',
            'Public transportation delay',
            'Personal emergency in the morning',
            'Car trouble on the way to work',
        ],
        'EARLY_LEAVE': [
            'Medical appointment',
            'Family emergency',
            'Left early with supervisor approval',
            'Child pickup from school',
        ],
        'REPEATED_LATENESS': [
            'Multiple late arrivals this week',
            'Flagged by automated system for repeated tardiness',
            'Third lateness incident this month',
            'Pattern of morning tardiness detected',
        ],
        'OVERTIME_REQUEST': [
            'Project deadline - additional hours required',
            'Covering for absent colleague',
            'Urgent client request',
            'End of quarter processing',
        ],
        'SHORT_TIME': [
            'Left early due to illness',
            'Reduced hours approved by manager',
            'Half-day leave taken',
            'Power outage at office',
        ],
        'UNAUTHORIZED_ABSENCE': [
            'Did not report to work without notice',
            'No leave request submitted',
            'Absent without prior approval',
            'Failed to notify supervisor',
        ],
    };

    const reasonList = reasons[type] || ['Auto-generated exception for testing'];
    return reasonList[Math.floor(Math.random() * reasonList.length)];
}

seedReportData().catch(console.error);
