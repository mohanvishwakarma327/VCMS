const express = require('express');   
const router = express.Router();
const Booking = require("../models/booking"); // Ensure this model exists
const BookingConfirmation = require("../models/BookingConfirmation");

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect("/login");
}

// ✅ Route to render store page for store users
router.get("/store", isAuthenticated, async (req, res) => {
    try {
        const user = req.session.user;
        if (!user || user.user_group !== "store") {
            return res.redirect("/login");
        }

        // Fetch VC Sessions for the store user
        const vcSessions = await Booking.find({ email: user.email });

        // Fetch confirmed bookings
        const confirmedBookings = await BookingConfirmation.find({ status: "Accepted" });

        res.render("store", { user, vcSessions, confirmedBookings });
    } catch (error) {
        console.error("❌ Error fetching VC Sessions:", error);
        res.render("store", { user: req.session.user, vcSessions: [], confirmedBookings: [] });
    }
});

// ✅ Route to handle VC booking
router.post("/bookVC", async (req, res) => {
    try {
        const { companyName, chairperson, designation, phone, email, bookedBy, vcPurpose, remark, vcDuration, vcStartDate, vcEndDate } = req.body;

        if (!companyName || !chairperson || !designation || !phone || !email || !bookedBy || !vcPurpose || !vcDuration || !vcStartDate || !vcEndDate) {
            return res.status(400).send("❌ Missing required fields.");
        }

        // Generate a unique 6-digit booking ID
        const bookingID = Math.floor(100000 + Math.random() * 900000);

        // Create and save new booking
        const newBooking = new Booking({
            bookingID,
            companyName,
            chairperson,
            designation,
            phone,
            email,
            bookedBy,
            vcPurpose,
            remark,
            vcDuration,
            vcStartDate,
            vcEndDate,
            status: "Pending"
        });

        await newBooking.save();
        res.send(`<script>alert("✅ Booking Successful! Your Booking ID: ${bookingID}"); window.location.href='/store';</script>`);

    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).send("Booking Failed. Please try again.");
    }
});

// ✅ Route to render booking list
router.get("/booking-list", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.render("booking-list", { bookings });
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Route to handle booking confirmation
router.post("/booking/confirm", async (req, res) => {
    try {
        const { bookingID, conferenceName, bridgeId, remarks, rejectionReason, status } = req.body;

        if (!bookingID || !status) {
            return res.status(400).send("❌ Booking ID and status are required.");
        }

        // Save booking confirmation
        const newConfirmation = new BookingConfirmation({
            bookingID,
            conferenceName,
            bridgeId,
            remarks,
            rejectionReason: status === "Rejected" ? rejectionReason : null,
            status
        });

        await newConfirmation.save();
        res.send(`<script>alert("✅ Booking ${status}!"); window.location.href = "/store";</script>`);
    } catch (error) {
        console.error("❌ Error confirming booking:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ API: Get confirmed bookings for frontend
router.get("/api/confirmation", async (req, res) => {
    try {
        const confirmedBookings = await BookingConfirmation.find({ status: "Accepted" }).sort({ createdAt: -1 });
        res.json(confirmedBookings);
    } catch (error) {
        console.error("❌ Error fetching confirmed bookings:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// ✅ Route to render confirmation page
router.get("/confirmation", async (req, res) => {
    try {
        const bookings = await BookingConfirmation.find({ status: "Accepted" }).sort({ createdAt: -1 });

        console.log("✅ Bookings fetched from MongoDB:", bookings); // Debugging log

        res.render("confirmation", { bookings }); // ✅ Make sure 'bookings' is being passed
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.render("confirmation", { bookings: [] }); // ✅ Ensure bookings is always defined
    }
});


module.exports = router;
