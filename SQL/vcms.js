const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// ✅ Users Schema
const userSchema = new mongoose.Schema({
    user_group: { type: String, enum: ['Admin', 'store', 'vnoc'], required: true },
    store: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true }, // Made phone required
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    password: { type: String, required: true },
    isAssigned: { type: Boolean, default: false }, // Added isAssigned to schema
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
// const bookingSchema = new mongoose.Schema({
//     companyName: { type: String, required: true },
//     chairperson: { type: String, required: true },
//     contactNumber: { type: String, required: true },
//     email: { type: String, required: true },
//     vcPurpose: { type: String, required: true },
//     department: { type: String, required: true },
//     remark: { type: String },
//     vcDuration: { type: Number, required: true },
//     vcType: { type: String, enum: ['audio', 'video', 'hybrid'], required: true },
//     vcStartDate: { type: Date, required: true },
//     vcEndDate: { type: Date, required: true },
//     recording: { type: String, enum: ['yes', 'no'], required: true },
//     billingSection: { type: String, enum: ['prepaid', 'postpaid'], required: true },
//     created_at: { type: Date, default: Date.now }
// });

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

// for vc confirmation
const BookingConfirmationSchema = new mongoose.Schema({
    bookingId: { type: String, required: true }, 
    conferenceName: { type: String, required: true }, 
    bridgeId: { type: String, required: true },
    remarks: { type: String }, 
    rejectionReason: { type: String },
    status: { type: String, enum: ["Accepted", "Rejected"], default: "Accepted" }, // Store booking status
    createdAt: { type: Date, default: Date.now } 
});

// ✅ Create Models
// const User = mongoose.model("User", userSchema);
// const Client = mongoose.model("Client", clientSchema);
// const Booking = mongoose.model("Booking", bookingSchema);
// const VCBooking = mongoose.model("VCBooking", vcBookingSchema);
// const vcms = mongoose.model("vcms", userSchema); // ✅ Fixed: Defined before exporting
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
// const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
const VCBooking = mongoose.models.VCBooking || mongoose.model("VCBooking", vcBookingSchema);


// ✅ Insert Default Admin User if Not Exists
(async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@vcnow.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("Admin@123", 10);

            const adminUser = new User({
                user_group: "Admin",
                store: "Delhi",
                username: "Super Admin",
                email: "admin@vcnow.com",
                password: "1234",
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


// ✅ Delete  User if Exists   right on 20-03-2025
async function deleteUser(email) {
    try {
        const deletedUser = await User.findOneAndDelete({ email: email });

        if (deletedUser) {
            console.log(`✅ User with email '${email}' deleted successfully.`);
        } else {
            console.log(`⚠️ User with email '${email}' not found.`);
        }
    } catch (error) {
        console.error("❌ Error Deleting User:", error);
    }
}



// Function to Insert Data
const insertBookingConfirmation = async () => {
    try {
        const newBooking = new BookingConfirmation({
            bookingId: "123456",
            conferenceName: "Annual Tech Conference",
            bridgeId: "Bridge1",
            remarks: "VIP access required",
            rejectionReason: null, // Set if status is 'Rejected'
            status: "Accepted"
        });

        const savedBooking = await newBooking.save();
        console.log("✅ Booking saved:", savedBooking);
    } catch (error) {
        console.error("❌ Error inserting booking:", error);
    } finally {
        mongoose.connection.close(); // Close connection after insertion
    }
};

// // Call the function
// insertBookingConfirmation();


module.exports = mongoose.model("BookingConfirmation", BookingConfirmationSchema);
// ✅ Export Models (Fixed)
module.exports = { vcms, User, Client, VCBooking };


