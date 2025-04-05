const express = require("express");
const router = express.Router();
const BookingConfirmation = require("../models/BookingConfirmation");

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
