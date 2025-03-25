// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/booking");

// // VNOC Dashboard - View Pending Bookings
// router.get("/dashboard", async (req, res) => {
//     try {
//         const allBookings = await Booking.find(); // Fetch all bookings from MongoDB
//         const pendingBookings = allBookings.filter(b => b.status === "Pending").length;
//         const approvedBookings = allBookings.filter(b => b.status === "Approved").length;
//         const rejectedBookings = allBookings.filter(b => b.status === "Rejected").length;
    
//         res.render("vnoc-dashboard", { 
//             pendingBookings, 
//             approvedBookings, 
//             rejectedBookings, 
//             latestBookings: allBookings
//         });
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).send("Error loading dashboard");
//     }
// });


// // Sample data (Replace with DB Query)
// const bookings = [
//     { storeName: "Store A", date: "2025-03-24", time: "10:00 AM", status: "Pending" },
//     { storeName: "Store B", date: "2025-03-24", time: "12:00 PM", status: "Approved" },
//     { storeName: "Store C", date: "2025-03-24", time: "2:00 PM", status: "Rejected" }
// ];

// // VNOC Dashboard Route
// router.get("/dashboard", (req, res) => {
//     const pendingBookings = bookings.filter(b => b.status === "Pending").length;
//     const approvedBookings = bookings.filter(b => b.status === "Approved").length;
//     const rejectedBookings = bookings.filter(b => b.status === "Rejected").length;
    
//     res.render("vnoc-dashboard", { 
//         pendingBookings, 
//         approvedBookings, 
//         rejectedBookings, 
//         latestBookings: bookings 
//     });
// });

// // Approve Booking & Enter Zoom Link    
// router.post("/approve/:id", async (req, res) => {
//     try {
//         const { zoomLink } = req.body;
//         if (!zoomLink || !zoomLink.startsWith("https://zoom.us/")) {
//             return res.status(400).send("Invalid Zoom link.");
//         }

//         await Booking.findByIdAndUpdate(req.params.id, { status: "Confirmed", zoomLink });

//         res.redirect("/vnoc");
//     } catch (error) {
//         console.error("Error approving booking:", error);
//         res.status(500).send("Error approving booking");
//     }
// });

// // Reject Booking with Reason
// router.post("/reject/:id", async (req, res) => {
//     try {
//         const { reason } = req.body;
//         if (!reason) {
//             return res.status(400).send("Rejection reason required.");
//         }

//         await Booking.findByIdAndUpdate(req.params.id, { status: "Rejected", rejectionReason: reason });

//         res.redirect("/vnoc");
//     } catch (error) {
//         console.error("Error rejecting booking:", error);
//         res.status(500).send("Error rejecting booking");
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// VNOC Dashboard - View Pending Bookings
router.get("/vnoc", async (req, res) => {
    try {
        const allBookings = await Booking.find(); // Fetch all bookings from MongoDB
        const pendingBookings = allBookings.filter(b => b.status.toLowerCase() === "pending").length;
        const approvedBookings = allBookings.filter(b => b.status.toLowerCase() === "approved").length;
        const rejectedBookings = allBookings.filter(b => b.status.toLowerCase() === "rejected").length;
    
        res.render("vnoc", { 
            pendingBookings, 
            approvedBookings, 
            rejectedBookings, 
            latestBookings: allBookings
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error loading dashboard");
    }
});

// Approve Booking & Enter Zoom Link    by krishna on 25 march
router.post("/approve/:id", async (req, res) => {
    try {
        const { zoomLink } = req.body;
        if (!zoomLink || !zoomLink.startsWith("https://zoom.us/")) {
            return res.status(400).send("Invalid Zoom link.");
        }

        await Booking.findByIdAndUpdate(req.params.id, { status: "Confirmed", zoomLink });

        res.redirect("/vnoc"); // ✅ Redirect to correct path
    } catch (error) {
        console.error("Error approving booking:", error);
        res.status(500).send("Error approving booking");
    }
});

// Reject Booking with Reason
router.post("/reject/:id", async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).send("Rejection reason required.");
        }

        await Booking.findByIdAndUpdate(req.params.id, { status: "Rejected", rejectionReason: reason });

        res.redirect("/vnoc"); // ✅ Redirect to correct path
    } catch (error) {
        console.error("Error rejecting booking:", error);
        res.status(500).send("Error rejecting booking");
    }
});

module.exports = router;

