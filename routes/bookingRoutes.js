const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Booker Dashboard
router.get('/bookerdashboard', (req, res) => {
    res.render('bookerdashboard');
});

// Book a VC
router.post('/bookVC', (req, res) => {
    const { bookerName, vcDate, vcTime, attendees } = req.body;
    const sql = `INSERT INTO bookings (booker_name, vc_date, vc_time, attendees, status) VALUES (?, ?, ?, ?, 'Pending')`;

    db.query(sql, [bookerName, vcDate, vcTime, attendees], (err, result) => {
        if (err) return res.status(500).json({ error: "Booking failed" });
        res.json({ message: "VC session booked successfully" });
    });
});

// Get latest booking
router.get('/getLatestBooking', (req, res) => {
    const sql = `SELECT * FROM bookings ORDER BY id DESC LIMIT 1`;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Could not fetch bookings" });
        res.json(results[0] || { message: "No bookings available" });
    });
});

// Confirm or Reject Booking
router.post('/confirmBooking', (req, res) => {
    const { bookingId, status } = req.body;
    const sql = `UPDATE bookings SET status = ? WHERE id = ?`;

    db.query(sql, [status, bookingId], (err, result) => {
        if (err) return res.status(500).json({ error: "Could not update booking" });
        res.json({ message: `Booking ${status}` });
    });
});

module.exports = router;
