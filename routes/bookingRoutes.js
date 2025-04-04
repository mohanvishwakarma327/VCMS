const express = require("express");
const router = express.Router();
const VCBooking = require("../models/booking"); // Import Booking model
const BookingConfirmation = require("../models/BookingConfirmation"); // Import Confirmation model

// ✅ Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "❌ Unauthorized. Please log in." });
    }
    next();
}

// ✅ Get all bookings for the logged-in user
router.get("/get-bookings", isAuthenticated, async (req, res) => {
    try {
        const userEmail = req.session.user.email; // Get logged-in user's email
        const bookings = await VCBooking.find({ email: userEmail }); // Fetch bookings for this user

        res.json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ message: "❌ Internal Server Error." });
    }
});

// ✅ Route to save a new booking confirmation
router.post("/booking/confirm", async (req, res) => {
    try {
        console.log("📥 Booking Data Received:", req.body); // Debug log

        const { bookingID, conferenceName, bridgeId, status, remarks } = req.body;
        if (!bookingID || !conferenceName || !bridgeId || !status) {
            return res.status(400).json({ error: "❌ Missing required fields." });
        }

        const newBooking = new BookingConfirmation({
            bookingID,
            conferenceName,
            bridgeId,
            status,
            remarks: remarks || "N/A",
            createdAt: new Date(),
        });

        const savedBooking = await newBooking.save();
        console.log("✅ Booking Saved:", savedBooking);
        res.json({ success: true, booking: savedBooking });
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        res.status(500).json({ error: "Failed to save booking" });
    }
});

module.exports = router;
