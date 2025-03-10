const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    status: { type: String, default: "active" },
});

module.exports = mongoose.model("Admin", AdminSchema);
