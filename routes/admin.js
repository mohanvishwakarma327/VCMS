
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

// // Middleware to check if user is logged in
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next(); // Proceed if authenticated
//     }
//     res.redirect("/login"); // Redirect to login if not authenticated
// }

// // ✅ Route to handle both Admin and Store users
// router.get('/admin', isAuthenticated, async (req, res) => {
//     try {
//         console.log("🔍 Session User:", req.session.user); // Debugging

//         const user = req.session.user;

//         if (!user || !user.user_group) {
//             console.log("❌ No user group found in session.");
//             return res.status(403).send("❌ Access Denied - No user group found");
//         }

//         if (user.user_group.toLowerCase() === "admin") {
//             const users = await User.find({}, "id username email");
//             return res.render('admin', { user, users }); // ✅ Render admin.ejs
//         } else if (user.user_group.toLowerCase() === "store") {
//             return res.render('store', { user }); // ✅ Render store.ejs
//         } else if (user.user_group.toLowerCase() === "vnoc") {
//             return res.render('vnoc', { user }); // ✅ write on 24 march by krishna
//          } else {
//             console.log("⚠️ Unknown user role:", user.user_group);
//             return res.status(403).send("❌ Access Denied - Unknown role");
//         }

//     } catch (error) {
//         console.error("❌ Database error:", error);
//         res.status(500).send("❌ Database error! Try again.");
//     }
// });

//  write on 24 march by krishna



// ✅ Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    next();
};

// ✅ Route to handle Admin, Store, and VNOC users
router.get('/admin', isAuthenticated, async (req, res) => {
    try {
        console.log("🔍 Session User:", req.session.user); // Debugging log

        const user = req.session.user;

        // 🛑 Validate user session & user group
        if (!user || !user.user_group) {
            console.log("❌ No user group found in session.");
            return res.status(403).send("❌ Access Denied - No user group found");
        }

        // 🎯 Redirect based on user role
        switch (user.user_group.toLowerCase()) {
            case "admin":
                const users = await User.find({}, "id username email"); // Fetch users for admin
                return res.render('admin', { user, users }); // ✅ Render admin.ejs
            case "store":
                return res.render('store', { user }); // ✅ Render store.ejs
            case "vnoc":
                return res.render('vnoc', { user }); // ✅ Render vnoc.ejs
            default:
                console.log("⚠️ Unknown user role:", user.user_group);
                return res.status(403).send("❌ Access Denied - Unknown role");
        }
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});


// ✅ VNOC Page Route  write on 24 march by krishna
router.get('/vnoc', isAuthenticated, async (req, res) => {
    try {
        console.log("🔍 Checking Session User:", req.session.user); // Debugging log

        if (!req.session.user) {
            console.log("❌ No user found in session. Redirecting to login.");
            return res.redirect('/login'); 
        }

        const user = req.session.user;

        if (user.user_group.toLowerCase() !== "vnoc") {
            return res.status(403).send("❌ Access Denied - You are not authorized to view this page.");
        }

        // ✅ Fetch booking counts from MongoDB
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });
        const approvedBookings = await Booking.countDocuments({ status: "Approved" });
        const rejectedBookings = await Booking.countDocuments({ status: "Rejected" });

        console.log("📊 Booking Counts:", { pendingBookings, approvedBookings, rejectedBookings });

        // ✅ Pass booking data to vnoc.ejs
        res.render('vnoc', { 
            user,
            pendingBookings,
            approvedBookings,
            rejectedBookings
        });

    } catch (error) {
        console.error("❌ Error fetching VNOC data:", error);
        res.status(500).send("❌ Internal Server Error");
    }
});

module.exports = router;
