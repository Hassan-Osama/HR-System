const bcrypt = require('bcryptjs');

// Generate a properly hashed password for Password@EMP-HR-001
const passwordToHash = 'Password@EMP-HR-001';

console.log('Generating hash for:', passwordToHash);

bcrypt.genSalt(10, (err, salt) => {
    if (err) {
        console.error('Error generating salt:', err);
        return;
    }

    bcrypt.hash(passwordToHash, salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        console.log('');
        console.log('=== COPY THIS HASH ===');
        console.log(hash);
        console.log('======================');
        console.log('');

        // Verify it works
        bcrypt.compare(passwordToHash, hash, (err, result) => {
            console.log('Verification test:', result ? 'SUCCESS' : 'FAILED');
        });
    });
});
