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


// 

const express = require('express');  
const router = express.Router();
const db = require("../config/db    "); // Ensure this points to your database configuration

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Proceed if authenticated
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// Function to generate a random 6-digit booking ID
function generateBookingID() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
}

// Route to render store page if user_group is "store"
router.get("/store", isAuthenticated, async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || user.user_group !== "store") {
            return res.redirect("/login");
        }

        // Fetch VC Sessions for the store user
        const [vcSessions] = await db.query("SELECT * FROM vc_sessions WHERE storeEmail = ?", [user.email]);

        res.render("store", { user, vcSessions }); // Pass vcSessions to EJS
    } catch (error) {
        console.error("Error fetching VC Sessions:", error);
        res.render("store", { user: req.session.user, vcSessions: [] }); // Pass empty array if there's an error
    }
});

// Route to handle VC booking
router.post("/bookVC", async (req, res) => {
    try {
        const { companyName, chairperson, designation, contactNumber, email, bookedBy, vcPurpose, remark, vcDuration, vcStartDate, vcEndDate } = req.body;

        // Generate a unique 6-digit booking ID
        const bookingID = generateBookingID();

        // Insert booking into the database
        const query = `INSERT INTO bookings (id, company_name, chairperson, designation, contact_number, email, booked_by, vc_purpose, remark, vc_duration, vc_start_date, vc_end_date, status) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [bookingID, companyName, chairperson, designation, contactNumber, email, bookedBy, vcPurpose, remark, vcDuration, vcStartDate, vcEndDate, "Pending"];

        await db.execute(query, values);

        res.status(200).send(`Booking Successful! Your Booking ID: ${bookingID}`);
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).send("Booking Failed. Please try again.");
    }
});
// Route to render the booking list page
router.get("/booking-list", isAuthenticated, async (req, res) => {
    try {
        // Fetch all bookings from the database
        const [bookings] = await db.execute("SELECT * FROM bookings");

        res.render("booking-list", { bookings }); // Render EJS page with bookings data
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
