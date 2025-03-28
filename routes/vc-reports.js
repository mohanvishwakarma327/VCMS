const express = require("express");
const router = express.Router();
const VCBooking = require("../models/vcBooking"); // Import VC Booking Model

router.get("/vc-reports", async (req, res) => {
    try {
        const selectedDate = req.query.date;
        if (!selectedDate) {
            return res.status(400).json({ error: "Date is required" });
        }

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch VC bookings from MongoDB for the selected date
        const vcBookings = await VCBooking.find({
            startTime: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json(vcBookings);
    } catch (error) {
        console.error("Error fetching VC bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
