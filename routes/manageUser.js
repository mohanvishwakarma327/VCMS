const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// 🟢 Render Form to Add User
router.get("/add_user", (req, res) => {
  res.render("addUser");
});

// 🟢 Save User to Database
router.post("/add_user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("⚠️ User already exists!");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.redirect("/manageuser"); // Redirect to user list after saving
  } catch (error) {
    res.status(500).send("❌ Error saving user: " + error.message);
  }
});

// 🟢 Fetch All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin", { users }); // Ensure you have users.ejs
  } catch (error) {
    res.status(500).send("❌ Error fetching users: " + error.message);
  }
});

module.exports = router;
