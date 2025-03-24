const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Your Mongoose model
const router = express.Router();

// app.post('/login', async (req, res) => {  
//     try {
//         const { email, password } = req.body;

//         // 🛑 Validate input
//         if (!email || !password) {
//             return res.status(400).json({ message: "❌ Email and password are required!" });
//         }

//         // 🔍 Find user by email in MongoDB
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "❌ User not found!" });
//         }

//         // 🔑 Compare hashed passwords
//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({ message: "❌ Incorrect password!" });
//         }

//         // ✅ Set session
//         req.session.user = user; 

//         // 🏆 Redirect to Admin Dashboard
//         res.redirect('/admin');

//     } catch (error) {
//         console.error("❌ Error during login:", error);
//         res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
//     }
// });

app.post('/login', async (req, res) => {  
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "❌ Incorrect password!" });
        }

        // ✅ Set user in session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            user_group: user.user_group // 🔥 Ensure user_group is stored
        };

        console.log("✅ Session set:", req.session.user);

        // ✅ Redirect based on user_group
        if (user.user_group === "admin") {
            return res.redirect("/admin");
        } else if (user.user_group === "store") {
            return res.redirect("/store");
        } else {
            return res.status(403).json({ message: "❌ Unauthorized user group" });
        }

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Try again." });
    }
});



module.exports = router;
