const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
function requireAdminAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next(); // Admin is authenticated, proceed
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// Protect the admin route
// app.get("/admin", requireAdminAuth, (req, res) => {
//     res.render("admin"); // Only render if authenticated
// });

app.get('/admin', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    res.render('admin', { user: req.session.user }); // Render admin.ejs
});

app.get('/admin', isAuthenticated, async (req, res) => {
    try {
        // Ensure the logged-in user is an admin
        if (req.session.user.user_group !== "Admin") {
            return res.status(403).send("❌ Access Denied");
        }

        // Fetch all users from MongoDB
        const users = await User.find({}, "id username email");

        // Render the admin dashboard
        res.render('admin', { user: req.session.user, users });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});



module.exports = router;
