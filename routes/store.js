// const express = require('express'); 
// const router = express.Router();

// // Middleware to check if user is logged in
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next(); // Proceed if authenticated
//     }
//     res.redirect("/login"); // Redirect to login if not authenticated
// }

// // Route to handle different user roles
// router.get('/store', isAuthenticated, (req, res) => {
//     const user = req.session.user || null; // Ensure 'user' is always defined

//     if (user && user.role === "admin") {
//         return res.redirect('/admin'); // Redirect admin users
//     } else if (user && user.role === "store") {
//         // return res.render('store', { user }); // Render Booker Dashboard
//         return res.redirect('/store'); // Redirect store users change on 22 march 2025 by krishna
//      } else {
//         return res.render('store', { user: null }); // Ensure 'user' is always available
//     }
// });


// module.exports = router;

// // change by krishna on 22 march 
// const express = require('express');
// const router = express.Router();
// const User = require('../models/user'); // Import User model chnge by krishna on 24 march

// // Middleware to check if user is logged in
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next(); // Proceed if authenticated
//     }
//     res.redirect("/login"); // Redirect to login if not authenticated
// }

// // Route to render store page if user_group is "store"
// router.get('/store', isAuthenticated, (req, res) => {
//     const user = req.session.user || null; // Ensure 'user' is always defined

//     if (!user) {
//         return res.redirect("/login"); // Redirect if no user is found
//     }

//     if (user.user_group === "store") {
//         return res.redirect('/store'); // Redirect admin users
//     } 
//     else if (user.user_group === "admin") {
//         return res.render('admin', { user }); // ✅ Render store.ejs for store users
//     } 
//     else {
//         return res.redirect('/user-dashboard'); // ✅ Redirect others to user dashboard
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

// Route to render store page if user_group is "store"
app.get("/store", async (req, res) => {
    try {
        // Fetch VC Sessions from your database
        const vcSessions = await db.query("SELECT * FROM vc_sessions"); // Adjust as per your DB query method

        res.render("store", { vcSessions }); // Pass vcSessions to EJS
    } catch (error) {
        console.error("Error fetching VC Sessions:", error);
        res.render("store", { vcSessions: [] }); // Pass empty array if there's an error
    }
});

router.get('/store', isAuthenticated, async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || user.user_group !== "store") {
            return res.redirect("/login");
        }

        const vcSessions = await Booking.find({ storeEmail: user.email });

        res.render("store", { user, vcSessions }); // Pass updated bookings to store.ejs
    } catch (error) {
        console.error("Error fetching store bookings:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
