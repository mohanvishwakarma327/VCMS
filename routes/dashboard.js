const express = require('express');
const router = express.Router();

router.get('/vnoc-dashboard', async (req, res) => {
    try {
        // Mock Data (Replace with actual DB queries)
        const reports = [
            { id: 1, type: "Daily Report", date: "2025-03-26", status: "Completed" },
            { id: 2, type: "Weekly Report", date: "2025-03-20", status: "Pending" }
        ];
        
        const bookings = [
            { id: 101, user: "John Doe", date: "2025-03-27", status: "Confirmed" },
            { id: 102, user: "Jane Smith", date: "2025-03-28", status: "Pending" }
        ];

        const vcSessions = [
            { id: "VC123", host: "Admin", startTime: "10:00 AM", link: "https://zoom.us/j/123456" },
            { id: "VC456", host: "Manager", startTime: "3:00 PM", link: "https://zoom.us/j/654321" }
        ];

        const cancelRequests = [
            { id: 201, user: "Alice", reason: "Reschedule needed" },
            { id: 202, user: "Bob", reason: "Technical issues" }
        ];

        res.render('vnoc-dashboard', { reports, bookings, vcSessions, cancelRequests });

    } catch (error) {
        console.error("Error loading VNOC Dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
