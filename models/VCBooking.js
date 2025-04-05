const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    chairperson: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    vcPurpose: { type: String, required: true },
    department: { type: String, required: true },
    remark: { type: String },
    // vcDuration: { type: Number, required: true },
    vcType: { type: String, enum: ['audio', 'video', 'hybrid'], required: true },
    vcStartDate: { type: Date, required: true },
    vcEndDate: { type: Date, required: true },
    recording: { type: String, enum: ['yes', 'no'], required: true },
    billingSection: { type: String, enum: ['prepaid', 'postpaid'], required: true },
    created_at: { type: Date, default: Date.now }
});

// ✅ Prevent model re-compilation
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

module.exports = Booking;
