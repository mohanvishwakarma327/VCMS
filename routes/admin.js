
// // change on 22 march 2025
// const express = require('express');
// const router = express.Router();
// const User = require('../models/user'); // Ensure you import the User model

// // Middleware to check authentication
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next(); // Proceed if authenticated
//     }
//     res.redirect("/login"); // Redirect if not logged in
// }

// // ✅ Route for both Admin and Store Users
// router.get('/admin', isAuthenticated, async (req, res) => {
//     try {
//         console.log("🔍 Session User:", req.session.user); // Debugging line

//         const user = req.session.user;

//         if (!user || !user.user_group) {
//             console.log("❌ No user group found in session.");
//             return res.status(403).send("❌ Access Denied - No user group found");
//         }

//         if (user.user_group === "admin") {
//             const users = await User.find({}, "id username email");
//             return res.render('admin', { user, users });
//         } else if (user.user_group === "store") {
//             return res.render('store', { user });
//         } else {
//             console.log("❌ User group is neither admin nor store.");
//             return res.status(403).send("❌ Access Denied - Invalid user group");
//         }
//     } catch (error) {
//         console.error("❌ Database error:", error);
//         res.status(500).send("❌ Database error! Try again.");
//     }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import User model

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Proceed if authenticated
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// ✅ Route to handle both Admin and Store users
router.get('/admin', isAuthenticated, async (req, res) => {
    try {
        console.log("🔍 Session User:", req.session.user); // Debugging

        const user = req.session.user;

        if (!user || !user.user_group) {
            console.log("❌ No user group found in session.");
            return res.status(403).send("❌ Access Denied - No user group found");
        }

        if (user.user_group.toLowerCase() === "admin") {
            const users = await User.find({}, "id username email");
            return res.render('admin', { user, users }); // ✅ Render admin.ejs
        } else if (user.user_group.toLowerCase() === "store") {
            return res.render('store', { user }); // ✅ Render store.ejs
        } else {
            console.log("⚠️ Unknown user role:", user.user_group);
            return res.status(403).send("❌ Access Denied - Unknown role");
        }

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});

module.exports = router;
