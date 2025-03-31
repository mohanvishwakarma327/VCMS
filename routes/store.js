const express = require('express');  
const router = express.Router();
const mongoose = require("mongoose");
const db = require("../config/database"); // Ensure this points to your database configuration
const Booking = require("../models/booking"); // Ensure this model exists

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
        const vcSessions = await Booking.find({ email: user.email }); // MongoDB query

        res.render("store", { user, vcSessions }); // Pass vcSessions to EJS
    } catch (error) {
        console.error("Error fetching VC Sessions:", error);
        res.render("store", { user: req.session.user, vcSessions: [] }); // Pass empty array if there's an error
    }
});

// Route to handle VC booking
router.post("/bookVC", async (req, res) => {
    try {
        const { companyName, chairperson, designation, phone, email, bookedBy, vcPurpose, remark, vcDuration, vcStartDate, vcEndDate } = req.body;

        // ✅ Check if contactNumber or other required fields are missing
        if (!companyName || !chairperson || !designation || !phone || !email || !bookedBy || !vcPurpose || !vcDuration || !vcStartDate || !vcEndDate) {
            return res.status(400).send("❌ Missing required fields. Please fill all fields.");
        }

        // ✅ Generate a unique 6-digit booking ID
        const bookingID = Math.floor(100000 + Math.random() * 900000) ;

        // ✅ Create a new booking document
        const newBooking = new Booking({
            bookingID,
            companyName,
            chairperson,
            designation,
            phone,  // Ensure this is provided
            email,
            bookedBy,
            vcPurpose,
            remark,
            vcDuration,
            vcStartDate,
            vcEndDate,
            status: "Pending"
        });

        // ✅ Save the booking in MongoDB
        await newBooking.save();

        // res.status(200).send(`✅ Booking Successful! Your Booking ID: ${bookingID}`);
        res.send(`<script>alert("✅ Booking Successful! Your Booking ID: ${bookingID}"); window.location.href='/store';</script>`);

    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).send("Booking Failed. Please try again.");
    }
});


// Route to render the booking list page
router.get("/booking-list", async (req, res) => {
    try {
        console.log("📌 Fetching bookings...");
        const bookings = await Booking.find(); // ✅ Correct MongoDB query
        console.log("✅ Bookings fetched successfully:", bookings);
        
        res.render("booking-list", { bookings });
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
