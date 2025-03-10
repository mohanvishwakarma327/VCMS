const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ✅ Users Schema
const userSchema = new mongoose.Schema({
    user_group: { type: String, enum: ['Admin', 'Manager', 'Staff'], required: true },
    store: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isAssigned: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

// ✅ Clients Schema
const clientSchema = new mongoose.Schema({
    client_name: { type: String, required: true },
    client_email: { type: String, unique: true, required: true },
    client_phone: { type: String, required: true },
    client_address: { type: String, required: true },
    client_city: { type: String, required: true },
    client_state: { type: String, required: true },
    client_zip: { type: String, required: true },
    client_country: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// ✅ Bookings Schema
const bookingSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    chairperson: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    vcPurpose: { type: String, required: true },
    department: { type: String, required: true },
    remark: { type: String },
    vcDuration: { type: Number, required: true },
    vcType: { type: String, enum: ['audio', 'video', 'hybrid'], required: true },
    vcStartDate: { type: Date, required: true },
    vcEndDate: { type: Date, required: true },
    recording: { type: String, enum: ['yes', 'no'], required: true },
    billingSection: { type: String, enum: ['prepaid', 'postpaid'], required: true },
    created_at: { type: Date, default: Date.now }
});

// ✅ VC Bookings Schema
const vcBookingSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    chairperson: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    vcPurpose: { type: String, required: true },
    department: { type: String, required: true },
    vcDuration: { type: Number, required: true },
    vcType: { type: String, enum: ['audio', 'video', 'hybrid'], required: true },
    vcStartDate: { type: Date, required: true },
    vcEndDate: { type: Date, required: true },
    recording: { type: String, enum: ['yes', 'no'], required: true },
    billingSection: { type: String, enum: ['prepaid', 'postpaid'], required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    joinLink: { type: String },
    created_at: { type: Date, default: Date.now }
});

// ✅ Create Models
const User = mongoose.model("User", userSchema);
const Client = mongoose.model("Client", clientSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const VCBooking = mongoose.model("VCBooking", vcBookingSchema);

// ✅ Insert Default Admin User if Not Exists
(async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@vcnow.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("Admin@123", 10); // Change if necessary

            const adminUser = new User({
                user_group: "Admin",
                store: "MainStore",
                username: "Super Admin",
                email: "admin@vcnow.com",
                password: hashedPassword, // Ensure password is hashed
                phone: "9876543210",
                status: "active",
                isAssigned: true
            });

            await adminUser.save();
            console.log("✅ Default admin user created.");
        } else {
            console.log("ℹ️ Admin user already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
    }
})();

// ✅ Export Models
module.exports = { User, Client, Booking, VCBooking };
