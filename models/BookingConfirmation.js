const mongoose = require("mongoose");

const BookingConfirmationSchema = new mongoose.Schema({
    bookingID: { type: String, required: true }, 
    conferenceName: { type: String, required: true }, 
    bridgeId: { type: String, required: true },
    remarks: { type: String }, 
    rejectionReason: { type: String },
    status: { type: String, enum: ["Accepted", "Rejected"], default: "Accepted" }, // Store booking status
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("BookingConfirmation", BookingConfirmationSchema);
