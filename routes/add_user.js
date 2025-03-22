const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import Mongoose User model
const router = express.Router();

// ✅ Add User Route
router.post('/add_user', async (req, res) => {
    try {
        const { user_group, store, username, email, phone, status, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "⚠️ User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            user_group,
            store,
            username,
            email,
            phone,
            status,
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();
        // res.status(201).json({ message: "✅ User created successfully!" });

          // ✅ Return success message with Login Button
          res.status(201).send(`
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h2 style="color: green;">✅ User created successfully!</h2>
                <p>You can now log in using your credentials.</p>
                <a href="/admin" style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                    🔑 Go to Back
                </a>
            </div>
        `);

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "🚨 Internal Server Error. Please try again." });
    }
});

module.exports = router;
