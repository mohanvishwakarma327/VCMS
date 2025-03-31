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

// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     companyName: String,
//     chairperson: String,
//     vcStartDate: Date,
//     vcEndDate: Date,
//     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     joinLink: String,
//     email: { type: String, required: true } // Ensure email is stored!
// });

// module.exports = mongoose.model("Booking", bookingSchema);


// write 31 march by krishn

const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    bookingID: { type: Number, required: true, unique: true },
    companyName: { type: String, required: true },
    chairperson: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bookedBy: { type: String, required: true },
    vcPurpose: { type: String, required: true },
    remark: { type: String },
    vcDuration: { type: String, required: true },
    vcStartDate: { type: Date, required: true },
    vcEndDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
