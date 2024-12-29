const mongoose = require("mongoose");
const { User } = require("../models/mongoose");
const { Student } = require("../../exam/models/Student");

async function migrateStudentUsername() {
    try {
        // Fetch all students
        const students = await Student.find();

        // Loop through each student and update username
        for (const student of students) {
            // Find corresponding user and get username
            const user = await User.findById(student.username);
            if (user) {
                // Update student with username
                await Student.updateOne(
                    { _id: student._id },
                    { $set: { username: user.username } }
                );
                console.log(`Updated student ${student._id} with username ${user.username}`);
            } else {
                console.error(`User not found for student ${student._id}`);
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect(); // Close connection after migration
    }
}

// Connect to MongoDB and start migration
async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/examchain');
        console.log('MongoDB connected');
        await migrateStudentUsername();
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);