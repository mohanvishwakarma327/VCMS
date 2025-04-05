const express = require("express");
const router = express.Router();
const BookingConfirmation = require("../models/BookingConfirmation");

// Route to get daily reports for approved bookings
router.get("/daily-report", async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ error: "Date is required!" });

        // Convert selected date to match database format
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Fetch only accepted bookings
        const approvedBookings = await BookingConfirmation.find({
            status: { $in: ["Accepted", "Approved"] }, // Only fetch accepted/approved
            createdAt: { $gte: startDate, $lte: endDate }
        });

        res.json(approvedBookings);
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});
// Route to render the report page
router.get("/daterange-report", async (req, res) => {
    try {
        // Fetch all accepted reports (adjust query if needed)
        const reports = await BookingConfirmation.find({ status: "Accepted" }).lean();
        
        // Render the EJS file and pass the reports
        res.render("daterange-report", { reports });
    } catch (error) {
        console.error("❌ Error fetching reports:", error);
        res.status(500).send("Failed to load reports");
    }
});

module.exports = router;
