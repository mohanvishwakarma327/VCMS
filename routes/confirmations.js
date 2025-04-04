const express = require("express");
const router = express.Router();
const BookingConfirmation = require("../models/confirmations");

// GET /store/confirmation - render confirmation.ejs with data
router.get("/confirmation", async (req, res) => {
    try {
        const confirmedBookings = await BookingConfirmation.find();
        console.log("✅ Confirmed Bookings:", confirmedBookings);

        res.render("confirmation", { confirmedBookings });
    } catch (error) {
        console.error("❌ Error loading confirmation page:", error);
        res.status(500).send("Internal Server Error");
    }s
});
router.get("/confirmation", async (req, res) => {
    try {
        const confirmedBookings = await BookingConfirmation.find();
        res.render("store/confirmation", { confirmedBookings }); // Render EJS page
    } catch (err) {
        console.error("❌ Error fetching booking confirmations:", err);
        res.status(500).send("Server error");
    }
});

// API endpoint for frontend JS fetch
router.get("/api/confirmation", async (req, res) => {
    try {
        const confirmedBookings = await BookingConfirmation.find();
        res.json(confirmedBookings); // Send JSON response
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
