const express = require('express');  
const router = express.Router();
const mongoose = require("mongoose");
const db = require("../config/database"); // Ensure this points to your database configuration
const Booking = require("../models/booking"); // Ensure this model exists

const BookingConfirmation = require("../models/BookingConfirmation");

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


// Route to handle booking confirmation form submission
router.post("/booking/confirm", async (req, res) => {
    try {
        const { bookingID, conferenceName, bridgeId, remarks, rejectionReason, status } = req.body;

        // Save the booking confirmation in the database
        const newBooking = new BookingConfirmation({
            bookingID,
            conferenceName,
            bridgeId,
            remarks,
            rejectionReason: status === "Rejected" ? rejectionReason : null, // Store rejection reason only if rejected
            status
        });

        await newBooking.save();
        console.log("Booking confirmation saved:", newBooking);

        // Redirect to a success page or back to booking details
        // res.redirect("/store"); // Change "/store" to your appropriate redirect page
        // Show alert and reload the same page
        res.send(`<script>alert("✅ Booking Accepted!"); window.location.href = "/your-confirmation-page";</script>`);
    } catch (error) {
        console.error("Error confirming booking:", error);
        res.status(500).send("Internal Server Error");
    }
});




// Route to render the store page with booking confirmation data


router.get("/store", async (req, res) => {
    try {
        const confirmedBookings = await Booking.find({}); // Fetch confirmed bookings

        res.render("store", {
            user: req.session.user || null,
            confirmedBookings: confirmedBookings || [],
            booking: confirmedBookings.length > 0 ? confirmedBookings[0] : null, // Pass first booking if available
        });

    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.render("store", {
            user: req.session.user || null,
            confirmedBookings: [],
            booking: null // Ensure booking is always defined
        });
    }
});


// Route to render confirmation page
// Fetch confirmed bookings
router.get("/confirmation", async (req, res) => {
    try {
        const confirmedBookings = await Booking.find({ status: "Accepted" }).sort({ createdAt: -1 });

        console.log("Confirmed Bookings:", confirmedBookings); // Debugging Line

        res.render("confirmation", { confirmedBookings });
    } catch (error) {
        console.error("Error fetching confirmed bookings:", error);
        res.render("confirmation", { confirmedBookings: [] });
    }
});
module.exports = router;
