const mongoose = require('mongoose');
require('dotenv').config();

const CORRECT_PASSWORD_HASH = '$2b$10$b93/rmfiMnn03XCKNGsXKelirQyd9WfbwDyFB1.jd2dzqFofH9wBa';

async function fixPassword() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_system';
        console.log('Connecting to:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('');
        console.log('Available collections:');
        collections.forEach(col => console.log(' -', col.name));

        // Define the schema (minimal version)
        const employeeProfileSchema = new mongoose.Schema({}, { strict: false, collection: 'employee_profiles' });
        const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);

        // Try to find employee by different fields
        const email = 'fatima.mohammed@company.com';
        console.log('');
        console.log('Searching for employee with email:', email);

        let employee = await EmployeeProfile.findOne({ workEmail: email });
        if (!employee) {
            console.log('Not found by workEmail, trying personalEmail...');
            employee = await EmployeeProfile.findOne({ personalEmail: email });
        }

        if (!employee) {
            console.log('Not found by email, listing all employees...');
            const allEmployees = await EmployeeProfile.find({}).limit(5);
            console.log('Found', allEmployees.length, 'employees:');
            allEmployees.forEach(emp => {
                console.log(' -', emp.firstName, emp.lastName, '|', emp.workEmail, '|', emp.employeeNumber);
            });
        } else {
            console.log('');
            console.log('Found employee:', employee.firstName, employee.lastName);
            console.log('Current password hash:', employee.password);

            // Update the password
            console.log('');
            console.log('Updating password...');
            const result = await EmployeeProfile.updateOne(
                { _id: employee._id },
                { $set: { password: CORRECT_PASSWORD_HASH } }
            );

            console.log('Update result:', result);

            if (result.modifiedCount > 0) {
                console.log('✓ Password updated successfully!');

                // Verify
                const updated = await EmployeeProfile.findById(employee._id);
                console.log('New password hash:', updated.password.substring(0, 30) + '...');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('');
        console.log('Connection closed');
    }
}

fixPassword();
