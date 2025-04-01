const express = require("express");
const router = express.Router();
const Booking = require("../models/details");

// GET: Render the Booking Confirmation Page
// router.get("/:id", async (req, res) => {
//     try {
//         const booking = await Booking.findById(req.params.id);
//         if (!booking) {
//             return res.status(404).send("Booking not found");
//         }
//         res.render("bookingConfirmation", { booking });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });
router.get("/details/:_id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params._id);
        if (!booking) {
            return res.status(404).send("Booking not found");
        }
        res.render("bookingConfirmation", { booking });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// POST: Accept Booking
router.post("/:id/accept", async (req, res) => {
    try {
        const { bridgeId, remarks } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "Accepted", bridgeId, remarks },
            { new: true }
        );
        res.json({ success: true, message: "Booking accepted", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// POST: Reject Booking
router.post("/:id/reject", async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected", rejectionReason },
            { new: true }
        );
        res.json({ success: true, message: "Booking rejected", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
