// const express = require('express');
// const bcrypt = require('bcryptjs');
// const User = require('../models/user'); // Your Mongoose model
// const router = express.Router();

// app.post('/login', async (req, res) => {  
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ message: "❌ Email and password are required!" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "❌ User not found!" });
//         }

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(400).json({ message: "❌ Incorrect password!" });
//         }

//         // ✅ Set user in session
//         req.session.user = {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             user_group: user.user_group // 🔥 Ensure user_group is stored
//         };

//         console.log("✅ Session set:", req.session.user);

//         // ✅ Redirect based on user_group
//         if (user.user_group === "admin") {
//             return res.redirect("/admin");
//         } else if (user.user_group === "store") {
//             return res.redirect("/store");
//         } else {
//             return res.status(403).json({ message: "❌ Unauthorized user group" });
//         }

//     } catch (error) {
//         console.error("❌ Login Error:", error);
//         res.status(500).json({ message: "❌ Internal Server Error. Try again." });
//     }
// });



// module.exports = router;


// 26 march

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Ensure correct path for your User model
const router = express.Router();

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🛑 Validate Input
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required." });
        }

        // 🔍 Find user in MongoDB
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        // 🔑 Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        // ✅ Store User Session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            user_group: user.user_group.toLowerCase()
        };

        console.log("✅ User Logged In:", req.session.user);

        // 🎯 Redirect based on user group
        switch (req.session.user.user_group) {
            case "admin":
                return res.redirect("/admin"); // Redirect to Admin Dashboard
            case "store":
                return res.redirect("/store"); // Redirect to Store Page
            case "vnoc":
                return res.redirect("/vnoc"); // Redirect to VNOC Dashboard
            default:
                return res.status(403).send("❌ Access Denied");
        }

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).send("❌ Internal Server Error. Please try again.");
    }
});
module.exports = router;
