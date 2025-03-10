const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// ✅ Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Change this
        pass: 'your-email-password'  // Change this (use App Password if 2FA enabled)
    }
});

// ✅ Route to show forgot password page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

// ✅ Handle forgot password form submission
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // ✅ Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send("Database error!");
        if (results.length === 0) {
            return res.send('<script>alert("Email not found!"); window.location="/forgot-password";</script>');
        }

        // ✅ Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        const expireTime = Date.now() + 3600000; // 1 hour expiration

        // ✅ Store token in DB
        db.query("UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?", 
            [token, expireTime, email], (err) => {
                if (err) return res.status(500).send("Database error!");

                // ✅ Send Reset Email
                const resetLink = `http://127.0.0.1:5502/reset-password/${token}`;
                const mailOptions = {
                    to: email,
                    from: 'your-email@gmail.com', // Change this
                    subject: 'Password Reset - VCNow',
                    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) return res.status(500).send("Email sending failed!");
                    res.send('<script>alert("Reset link sent to your email!"); window.location="/login";</script>');
                });
            }
        );
    });
});

// ✅ Show Reset Password Form
router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // ✅ Verify token
    db.query("SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?", 
        [token, Date.now()], (err, results) => {
            if (err) return res.status(500).send("Database error!");
            if (results.length === 0) {
                return res.send('<script>alert("Invalid or expired token!"); window.location="/login";</script>');
            }
            res.render('reset-password', { token });
        }
    );
});

// ✅ Handle Reset Password Submission
router.post('/reset-password', (req, res) => {
    const { token, password } = req.body;

    // ✅ Find user with token
    db.query("SELECT * FROM users WHERE reset_token = ? AND reset_expires > ?", 
        [token, Date.now()], async (err, results) => {
            if (err) return res.status(500).send("Database error!");
            if (results.length === 0) {
                return res.send('<script>alert("Invalid or expired token!"); window.location="/login";</script>');
            }

            // ✅ Hash new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // ✅ Update user's password
            db.query("UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?", 
                [hashedPassword, token], (err) => {
                    if (err) return res.status(500).send("Database error!");
                    res.send('<script>alert("Password updated!"); window.location="/login";</script>');
                }
            );
        }
    );
});

module.exports = router;
