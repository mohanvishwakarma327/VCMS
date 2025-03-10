const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Import Mongoose User model
const router = express.Router();

// ✅ Add User Route
router.post('/add_user', async (req, res) => {
    try {
        const { userGroup, store, username, email, mobileNumber, status, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "⚠️ User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            userGroup,
            store,
            username,
            email,
            mobileNumber,
            status,
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();
        res.status(201).json({ message: "✅ User created successfully!" });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "🚨 Internal Server Error. Please try again." });
    }
});

module.exports = router;
