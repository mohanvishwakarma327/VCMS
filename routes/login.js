const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Your Mongoose model
const router = express.Router();

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: "❌ Invalid email or password" });
//         }

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "❌ Invalid email or password" });
//         }

//         // ✅ Store user info in session
//         req.session.user = {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.user_group // Assuming role is stored in `user_group`
//         };

//         console.log("✅ Session set:", req.session.user);

//         res.json({ message: "✅ Login successful!", redirect: "/admin" });

//     } catch (error) {
//         console.error("❌ Login Error:", error);
//         res.status(500).json({ message: "🚨 Internal Server Error. Try again." });
//     }
// });

app.post('/login', async (req, res) => {  
    try {
        const { email, password } = req.body;

        // 🛑 Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required!" });
        }

        // 🔍 Find user by email in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        // 🔑 Compare hashed passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "❌ Incorrect password!" });
        }

        // ✅ Set session
        req.session.user = user; 

        // 🏆 Redirect to Admin Dashboard
        res.redirect('/admin');

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
    }
});


module.exports = router;
