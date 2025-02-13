const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Nodemailer for email sending

const app = express();
const port = 5501;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mohansanty@7', // Replace with your MySQL password
    database: 'vcms'
});

db.connect(err => {
    if (err) console.error("❌ Database connection failed:", err);
    else console.log("✅ Connected to MySQL Database");
});

// Middleware
app.use(cors()); // Allow frontend requests
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Middleware
app.use(session({
    secret: 'vcnow-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ✅ LOGIN SYSTEM ✅

// Login Page
app.get('/login', (_, res) => {
    res.render('login');
});

// Signup Page
app.get('/signup', (_, res) => {
    res.render('signup');
});

// Add Client Page
app.get('/customer/clients', (_, res) => {
    res.render('customer/clients');
});

// Delete Clients
app.get('/manageuser/delete_user', (_, res) => {
    res.render('manageuser/delete_user');
});

// Add-User
app.get('/manageuser/add_user', (_, res) => {
    res.render('manageuser/add_user');
});

// Reset-User
app.get('/manageuser/reset_user', (_, res) => {
    res.render('manageuser/reset_user');
});

// CLient-Report
app.get('/reports/clientreport', (_, res) => {
    res.render('reports/clientreport');
});

// Daily-Report
app.get('/reports/dailyreport', (_, res) => {
    res.render('reports/dailyreport');
});

// Account  
app.get('/account/account', (_, res) => {
    res.render('account/account');
});

// Booker
app.get('/Bookerdashboard', (_, res) => {
    res.render('Bookerdashboard');
});

// Confirm
app.get('/confirm', (_, res) => {
    res.render('confirm');
});
// Booker-database
app.post('/Bookerdashboard', (req, res) => {
    const {
        companyName, chairperson, contactNumber, email,
        vcPurpose, department, remark, vcDuration, vcType,
        vcStartDate, vcEndDate, recording, billingSection
    } = req.body;

    const query = `INSERT INTO bookings 
        (companyName, chairperson, contactNumber, email, vcPurpose, department, remark, vcDuration, vcType, vcStartDate, vcEndDate, recording, billingSection)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        companyName, chairperson, contactNumber, email,
        vcPurpose, department, remark, vcDuration, vcType,
        vcStartDate, vcEndDate, recording, billingSection
    ], (err, result) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.send('Error saving booking.');
        }
        res.redirect('/Bookerdashboard'); // Redirect after successful booking
    });
});

// Route to get the latest pending booking
app.get('/confirm', (req, res) => {
    db.query("SELECT * FROM vc_bookings WHERE status = 'Pending' LIMIT 1", (error, results) => {
        if (error) {
            console.error("Error fetching booking:", error);
            return res.status(500).send("Error fetching booking data");
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send("No pending bookings found");
        }
    });
});

// Route to confirm the booking
app.post('/confirm', express.json(), (req, res) => {
    const { id, status, joinLink } = req.body;
    const query = "UPDATE vc_bookings SET status = ?, join_link = ? WHERE id = ?";
    
    db.query(query, [status, joinLink, id], (error, results) => {
        if (error) {
            console.error("Error updating booking status:", error);
            return res.status(500).send("Error updating booking status");
        }
        res.status(200).send(`Booking ${status}`);
    });
});

// Handle User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.send('<script>alert("Invalid email or password!"); window.location="/login";</script>');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = user;
            console.log("✅ User logged in:", email);
            res.redirect('/admin');  // Redirect to the admin page after login
        } else {
            res.send('<script>alert("Invalid email or password!"); window.location="/login";</script>');
        }
    });
});

// Route to send user session data to the frontend
app.get('/getUser', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.json({ user: null });
    }
});

// Admin adds a user
app.post('/manageuser/add_user', async (req, res) => {
    const { userGroup, circle, username, email, mobileNumber, status } = req.body;
    
    // Generate a default password (users can change later)
    const defaultPassword = 'User@123';  // Change this as needed
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check if the user already exists
    const checkSql = `SELECT * FROM users WHERE email = ?`;
    db.query(checkSql, [email], (err, results) => {
        if (err) {
            console.error("❌ Error checking user existence:", err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Insert new user into database
        const insertSql = `
            INSERT INTO users (user_group, store, username, email, password, mobile, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertSql, [userGroup, circle, username, email, hashedPassword, mobileNumber, status], (err) => {
            if (err) {
                console.error("❌ Error creating user:", err);
                return res.status(500).json({ message: 'Failed to create user' });
            }
            res.status(200).json({ message: 'User created successfully! Default password is User@123' });
        });
    });
});

// Nodemailer Setup for sending email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
        user: 'your_email@gmail.com', // Replace with your email address
        pass: 'your_email_password'    // Replace with your email password (use environment variables for better security)
    }
});

// Handle Client Configuration Form Submission
app.post('/customer/clients', (req, res) => {
    const { clientName, clientEmail, clientPhone, clientAddress, clientCity, clientState, clientZip, clientCountry } = req.body;

    // SQL Query to insert client into the database
    const sql = `
        INSERT INTO clients 
        (client_name, client_email, client_phone, client_address, client_city, client_state, client_zip, client_country) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [clientName, clientEmail, clientPhone, clientAddress, clientCity, clientState, clientZip, clientCountry], (err) => {
        if (err) {
            console.error("❌ Error adding client:", err);
            return res.status(500).send('Failed to add client configuration');
        }

        // Send Email to Admin
        const mailOptions = {
            from: 'your_email@gmail.com',   // Your email address
            to: 'admin_email@example.com',  // Admin's email address
            subject: 'New Client Configuration Added',
            text: `
                A new client has been added with the following details:
                
                Name: ${clientName}
                Email: ${clientEmail}
                Phone: ${clientPhone}
                Address: ${clientAddress}
                City: ${clientCity}
                State: ${clientState}
                ZIP: ${clientZip}
                Country: ${clientCountry}
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending email:", error);
                return res.status(500).send('Client configuration added, but failed to send email');
            }
            console.log("✅ Email sent:", info.response);
            res.status(200).send('Client configuration added successfully and email sent to admin!');
        });
    });
});

// Admin Page (Dashboard, Protected Route)
app.get('/admin', (req, res) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.redirect('/login'); // If not logged in, redirect to login
    }

    // Query to get all users for the admin page
    const sql = "SELECT * FROM users"; // You can modify this to filter users based on roles if needed
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }

        // Pass the user data and all users list to admin.ejs
        res.render('admin', { user: req.session.user, users: results });
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${port}`);
});
