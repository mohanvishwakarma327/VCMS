const express = require("express");
const router = express.Router();
const BookingConfirmation = require("../models/BookingConfirmation");
const { Parser } = require("json2csv");


// Utility to convert DD/MM/YYYY to JS Date
function parseDateString(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
}

// CSV export route
router.get("/range-csv", async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ error: "Both 'from' and 'to' dates are required." });
        }

        const fromDate = parseDateString(from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = parseDateString(to);
        toDate.setHours(23, 59, 59, 999);

        const bookings = await BookingConfirmation.find({
            status: { $in: ["Accepted", "Approved"] },
            createdAt: { $gte: fromDate, $lte: toDate }
        }).lean();

        if (bookings.length === 0) {
            return res.status(404).send("No bookings found for the selected date range.");
        }

        // Fields to include in CSV
        const fields = [
            { label: "Booking ID", value: "bookingID" },
            { label: "Conference Name", value: "conferenceName" },
            { label: "Bridge ID", value: "bridgeId" },
            { label: "Status", value: "status" },
            { label: "Remarks", value: row => row.remarks || "N/A" },
            { label: "Start Time", value: row => new Date(row.startTime).toLocaleString() },
            { label: "End Time", value: row => new Date(row.endTime).toLocaleString() },
            { label: "Created At", value: row => new Date(row.createdAt).toLocaleString() }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(bookings);

        const filename = `report_${from.replace(/\//g, "-")}_to_${to.replace(/\//g, "-")}.csv`;
        res.header("Content-Type", "text/csv");
        res.attachment(filename);
        res.send(csv);
    } catch (error) {
        console.error("❌ Error exporting CSV:", error);
        res.status(500).send("Failed to export report as CSV.");
    }
});

// ✅ New Route to get report by date range
router.get("/range", async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ error: "Both 'from' and 'to' dates are required." });
        }

        const fromDate = parseDateString(from);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = parseDateString(to);
        toDate.setHours(23, 59, 59, 999);

        const bookings = await BookingConfirmation.find({
            status: { $in: ["Accepted", "Approved"] },
            createdAt: { $gte: fromDate, $lte: toDate }
        });

        res.json(bookings);
    } catch (error) {
        console.error("❌ Error fetching range report:", error);
        res.status(500).json({ error: "Failed to fetch range report" });
    }
});

// Page route (optional)
router.get("/daterange-report", async (req, res) => {
    try {
        const reports = await BookingConfirmation.find({ status: "Accepted" }).lean();
        res.render("daterange-report", { reports });
    } catch (error) {
        console.error("❌ Error rendering daterange page:", error);
        res.status(500).send("Failed to load reports");
    }
});

module.exports = router;
