const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    storeEmail: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
    zoomLink: { type: String, default: "" },
    rejectionReason: { type: String, default: "" }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
