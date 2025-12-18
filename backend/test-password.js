const bcrypt = require('bcryptjs');

// The hashed password from the database
const hashedFromDB = '$2bS1OSbDQflHN3liyBh7pwfyT22.qTQgTzzrP.0lt/tJSE14S/flxXE6Oh.';

// The password we're trying to login with
const passwordToTest = 'Password@EMP-HR-001';

console.log('=== Password Verification Test ===');
console.log('Testing password:', passwordToTest);
console.log('Against hash:', hashedFromDB);
console.log('');

// Test comparison
bcrypt.compare(passwordToTest, hashedFromDB, (err, result) => {
    if (err) {
        console.error('Error during comparison:', err);
    } else {
        console.log('Password match result:', result);
    }

    console.log('');
    console.log('=== Testing with fresh hash ===');

    // Create a fresh hash to verify hashing is working
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(passwordToTest, salt, (err, hash) => {
            console.log('New hash:', hash);
            bcrypt.compare(passwordToTest, hash, (err, result) => {
                console.log('Fresh hash comparison:', result);
            });
        });
    });
});
