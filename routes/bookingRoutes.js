const express = require("express");
const router = express.Router();
const VCBooking = require("../models/booking"); // Import schema

// Get all bookings (Optional: Filter by status or user ID)
// router.get("/get-bookings", async (req, res) => {
//     try {
//         const bookings = await VCBooking.find(); // Fetch all bookings
//         res.json(bookings);
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).json({ error: "Failed to fetch bookings" });
//     }
// });


// 27 march
app.get('/get-bookings', async (req, res) => {
    try {
        // ✅ Ensure user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: "❌ Unauthorized. Please log in." });
        }

        const userEmail = req.session.user.email; // Get logged-in user's email

        // ✅ Fetch only the bookings for the logged-in user
        const bookings = await BookingModel.find({ email: userEmail });

        res.json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ message: "❌ Internal Server Error." });
    }
});
// Route to save a new booking confirmation
router.post("/booking/confirm", async (req, res) => {
    try {
        console.log("📥 Booking Data Received:", req.body); // Debug log

        const newBooking = new BookingConfirmation({
            bookingID: req.body.bookingID,
            conferenceName: req.body.conferenceName,
            bridgeId: req.body.bridgeId,
            status: req.body.status,
            remarks: req.body.remarks,
            createdAt: new Date()
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
