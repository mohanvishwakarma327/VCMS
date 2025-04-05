const mongoose = require("mongoose");
const BookingConfirmation = require("../models/BookingConfirmation");


const BookingConfirmationSchema = new mongoose.Schema({
    bookingID: { type: String, required: true },
    conferenceName: { type: String, required: true },
    bridgeId: { type: String },
    remarks: { type: String },
    rejectionReason: { type: String },
    status: { type: String, required: true, enum: ["Accepted", "Rejected", "Pending"] },
    createdAt: { type: Date, default: Date.now }
});




module.exports = mongoose.model("BookingConfirmation", BookingConfirmationSchema);
