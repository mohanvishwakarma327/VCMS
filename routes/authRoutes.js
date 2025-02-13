const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Signup Route
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Signup Error:", err);
            return res.status(500).send("Error creating account.");
        }
        res.send('<script>alert("Account created! Please login."); window.location="/login";</script>');
    });
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).send("Internal Server Error");
        if (results.length > 0) {
            res.redirect('/bookerdashboard'); // Redirect to Booker Dashboard
        } else {
            res.send('<script>alert("Invalid login."); window.location="/login";</script>');
        }
    });
});

module.exports = router;
