// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//     storeName: { type: String, required: true },
//     storeEmail: { type: String, required: true },
//     startTime: { type: Date, required: true }, // Merged date and time into a proper Date object
//     status: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
//     zoomLink: { type: String, default: "" },
//     rejectionReason: { type: String, default: "" }
// });

// // Export the model
// const Booking = mongoose.model("Booking", bookingSchema);
// module.exports = Booking;

// 27 march 

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    companyName: String,
    chairperson: String,
    vcStartDate: Date,
    vcEndDate: Date,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    joinLink: String,
    email: { type: String, required: true } // Ensure email is stored!
});

module.exports = mongoose.model("Booking", bookingSchema);
