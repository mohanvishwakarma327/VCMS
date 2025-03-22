// const express = require('express'); 
// const router = express.Router();

// // Middleware to check if user is logged in
// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.user) {
//         return next(); // Proceed if authenticated
//     }
//     res.redirect("/login"); // Redirect to login if not authenticated
// }

// // Route to handle different user roles
// router.get('/store', isAuthenticated, (req, res) => {
//     const user = req.session.user || null; // Ensure 'user' is always defined

//     if (user && user.role === "admin") {
//         return res.redirect('/admin'); // Redirect admin users
//     } else if (user && user.role === "store") {
//         // return res.render('store', { user }); // Render Booker Dashboard
//         return res.redirect('/store'); // Redirect store users change on 22 march 2025 by krishna
//      } else {
//         return res.render('store', { user: null }); // Ensure 'user' is always available
//     }
// });


// module.exports = router;

// change by krishna on 22 march 
const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // Proceed if authenticated
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// Route to render store page if user_group is "store"
router.get('/store', isAuthenticated, (req, res) => {
    const user = req.session.user || null; // Ensure 'user' is always defined

    if (!user) {
        return res.redirect("/login"); // Redirect if no user is found
    }

    if (user.user_group === "admin") {
        return res.redirect('/admin'); // Redirect admin users
    } 
    else if (user.user_group === "store") {
        return res.render('store', { user }); // ✅ Render store.ejs for store users
    } 
    else {
        return res.redirect('/user-dashboard'); // ✅ Redirect others to user dashboard
    }
});

module.exports = router;
