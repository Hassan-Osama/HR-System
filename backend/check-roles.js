const mongoose = require('mongoose');

async function checkUserRoles() {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_system';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);

        const db = mongoose.connection.db;

        console.log('--- COLLECTIONS ---');
        const collections = await db.listCollections().toArray();
        for (const coll of collections) {
            const count = await db.collection(coll.name).countDocuments();
            console.log(`- ${coll.name}: ${count} docs`);
        }

        console.log('--- USERS ---');
        const users = await db.collection('employee_profiles').find({}).toArray();
        console.log(`Found ${users.length} users in 'employee_profiles'`);
        for (const user of users) {
            console.log(`User: ${user.firstName} ${user.lastName} (${user.workEmail})`);
            console.log(`ID: ${user._id}`);
            console.log(`AccessProfileId: ${user.accessProfileId}`);

            if (user.accessProfileId) {
                const profile = await db.collection('employee_system_roles').findOne({ _id: user.accessProfileId });
                console.log(`Roles: ${JSON.stringify(profile?.roles)}`);
            } else {
                // Try fallback search by employeeProfileId
                const profile = await db.collection('employee_system_roles').findOne({ employeeProfileId: user._id });
                console.log(`Roles (by secondary lookup): ${JSON.stringify(profile?.roles)}`);
            }
            console.log('------------------');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUserRoles();
