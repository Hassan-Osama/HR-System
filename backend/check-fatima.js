const mongoose = require('mongoose');
require('dotenv').config();

async function checkUserRoles() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI not set in environment!');
            return;
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);

        const db = mongoose.connection.db;

        const email = 'fatima.mohammed@company.com';
        const user = await db.collection('employee_profiles').findOne({ workEmail: email });

        if (!user) {
            console.log(`User ${email} not found.`);
        } else {
            console.log(`User: ${user.firstName} ${user.lastName} (${user.workEmail})`);
            console.log(`ID: ${user._id}`);

            const profile = await db.collection('employee_system_roles').findOne({ employeeProfileId: user._id });
            if (profile) {
                console.log(`Roles: ${JSON.stringify(profile.roles)}`);
                console.log(`Permissions: ${JSON.stringify(profile.permissions)}`);
            } else {
                console.log('No EmployeeSystemRole found for this user.');
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUserRoles();
