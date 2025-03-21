const express = require('express'); 
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Proceed if authenticated
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// Route to handle different user roles
router.get('/bookerdashboard', isAuthenticated, (req, res) => {
    const user = req.session.user || null; // Ensure 'user' is always defined

    if (user && user.role === "admin") {
        return res.redirect('/admin'); // Redirect admin users
    } else if (user && user.role === "store") {
        return res.render('bookerdashboard', { user }); // Render Booker Dashboard
    } else {
        return res.render('bookerdashboard', { user: null }); // Ensure 'user' is always available
    }
});


module.exports = router;
