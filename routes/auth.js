const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Ensure this path is correct
const User = require('../models/user'); // Import Mongoose User model
require("dotenv").config(); // Load environment variables

// Admin Login Route
// 
router.post("/admin/login", async (req, res) => {
    try {
        console.log("Request received at /admin/login");

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Store admin session
        req.session.adminId = admin._id;

        res.redirect("/admin"); // Redirect to admin panel after login
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
