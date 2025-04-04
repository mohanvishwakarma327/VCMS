const mongoose = require("mongoose");

const bookingConfirmationSchema = new mongoose.Schema({
    bookingID: String,  // Match exactly as seen in MongoDB
    conferenceName: String,
    bridgeId: String,
    status: String,
    remarks: String,
    createdAt: { type: Date, default: Date.now }
}, { collection: "bookingconfirmations" });

const BookingConfirmation = mongoose.models.BookingConfirmation || mongoose.model("BookingConfirmation", bookingConfirmationSchema);
module.exports = BookingConfirmation;
