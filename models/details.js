const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    company: String,
    transId: String,
    chairPerson: String,
    vcType: String,
    contact: String,
    startTime: Date,
    endTime: Date,
    email: String,
    conferenceId: String,
    ucsParticipants: [
        {
            country: String,
            city: String,
            studio: String,
            roomName: String,
            videoNumber: String,
            roomIP: String
        }
    ]
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
module.exports = Booking;
