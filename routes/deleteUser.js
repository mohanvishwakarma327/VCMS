const express = require('express');
const User = require('../models/user'); // Import the User model
const router = express.Router();

router.delete('/delete_user', async (req, res) => {
    try {
        const { userIdentifier } = req.body;

        if (!userIdentifier) {
            return res.status(400).json({ message: "❌ User ID or Email is required!" });
        }

        let user;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(userIdentifier);

        if (isObjectId) {
            user = await User.findByIdAndDelete(userIdentifier);
        } else {
            user = await User.findOneAndDelete({ email: userIdentifier });
        }

        if (!user) {
            return res.status(404).json({ message: "🚫 User not found!" });
        }

        res.json({ message: `✅ User '${user.username}' deleted successfully!` });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "🚨 Internal Server Error. Try again!" });
    }
});

module.exports = router;
