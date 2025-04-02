const express = require("express");
const router = express.Router();
const BookingConfirmation = require("../models/BookingConfirmation");

// Handle Booking Confirmation Form Submission
router.post("/confirm", async (req, res) => {
    try {
        const { bookingID, conferenceName, bridgeId, remarks, rejectionReason, status } = req.body;

        const newConfirmation = new BookingConfirmation({
            bookingID,
            conferenceName,
            bridgeId,
            remarks,
            rejectionReason: status === "Rejected" ? rejectionReason : null,
            status,
        });

        await newConfirmation.save();
        res.redirect("/booking/success"); // Redirect to a success page
    } catch (error) {
        console.error("Error saving booking confirmation:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
