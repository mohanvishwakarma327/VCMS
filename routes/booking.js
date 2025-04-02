const express = require("express");
const router = express.Router();
const VCBookingModel = require("../models/vcBooking");

// 🛠 POST route to insert a new booking
router.post("/add-booking", async (req, res) => {
    try {
        // ✅ Validate session user
        if (!req.session.user) {
            return res.status(401).json({ message: "❌ User not logged in" });
        }

        const { vc_type, booking_date } = req.body;
        const email = req.session.user.email;
        const username = req.session.user.username;

        // 📌 Insert Data into MongoDB
        const newBooking = new VCBookingModel({
            email,
            username,
            vc_type,
            booking_date,
            status: "confirmed" // Default status
        });

        await newBooking.save();
        console.log("✅ Booking Added:", newBooking);
        res.status(201).json({ message: "✅ Booking successful", booking: newBooking });

    } catch (error) {
        console.error("❌ Error adding booking:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
});


// Handle booking confirmation
router.post("/confirm", async (req, res) => {
    try {
        const { bookingID, conferenceName, bridgeId, remarks, rejectionReason, status } = req.body;

        let updateData = {
            conferenceName,
            bridgeId,
            remarks: remarks || "N/A",
            status
        };

        if (status === "Rejected") {
            updateData.remarks = rejectionReason || "Rejected";
        }

        // Debugging Line
        console.log("Updating Booking:", bookingID, "with Status:", status);

        // Update booking in MongoDB
        const updatedBooking = await Booking.findOneAndUpdate(
            { bookingId: bookingID },
            updateData,
            { new: true } // Return the updated document
        );

        console.log("Updated Booking:", updatedBooking); // Debugging Line

        // Redirect to the confirmation page
        res.redirect("/confirmation");
    } catch (error) {
        console.error("Error confirming booking:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
