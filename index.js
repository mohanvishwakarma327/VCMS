const express = require('express'); 
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require("dotenv").config(); // Load .env file
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const authRoutes = require('./routes/auth');
const mongoose = require("mongoose"); // ✅ Correct
const manageUserRoutes = require("./routes/manageUser");
// const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();
const addUserRoute = require('./routes/add_user'); 
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user'); // Import User model
const dotenv = require("dotenv");
// const vcms = require('./SQL/vcms');


const app = express();
const PORT = process.env.PORT || 5502;

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vcms';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

const vcms = mongoose.connection;

module.exports = app;

// module.exports = vcms; // Export connection

//Routes
app.use("/auth", require("./routes/auth")); // Ensure this path is correct


// ✅ Middleware
app.use('/', authRoutes);
app.use('/views/manageuser', userRoutes);
// const userRoutes = require('./routes/userRoutes');
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
dotenv.config();
app.use(express.json());   // new write by 16-03-2025
app.use(express.urlencoded({ extended: true })); // new write by 16-03-2025
app.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true in production with HTTPS --change on 19-03-2025 by krish
}));


// ✅ Session Middleware
app.use(session({
    secret: 'a3f9b17c9e9a7b7d8e6c4a3f2e7b1c9a',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.post('/forgot-password', (req, res) => {
    res.json({ message: 'Forgot password route working!' });
});

// ✅ LOGIN SYSTEM
app.get('/login', (_, res) => 
    res.render('login'));
//confirm page
app.get('/confirm', (_, res) => 
    res.render('confirm'));
//forget-password
app.get('/forget-password', (_, res) => 
    res.render('forget-password'));
//admin-page
app.get('/admin', (_, res) => 
    res.render('admin'));
//customer/clients
app.get('/customer/clients', (_, res) => 
    res.render('customer/clients'));
//customer/location
app.get('/customer/add_location', (_, res) => 
    res.render('customer/add_location'));
//manageuser/add_user
app.get('/manageuser/add_user', (_, res) => 
    res.render('manageuser/add_user'));
//manageuser/delete_user
app.get('/manageuser/delete_user', (_, res) => 
    res.render('manageuser/delete_user'));
//manageuser/delete_user
app.get('/manageuser/reset_user', (_, res) => 
    res.render('manageuser/reset_user'));
//reports
app.get('/reports/clientreport', (_, res) => 
    res.render('reports/clientreport'));
//reports
app.get('/reports/dailyreport', (_, res) => 
    res.render('reports/dailyreport'));
//accounts
app.get('/account/account', (_, res) => 
    res.render('account/account'));
//Bookerdashboard
app.get('/bookerdashboard', (_, res) => 
    res.render('bookerdashboard'));
//forget-password
app.get('/forgot-password', (_, res) => 
    res.render('forgot-password'));
//User
app.get('/users/assignuser', (_, res) => 
    res.render('users/assignuser'));

//routes
app.use('/manageuser', addUserRoute);

// ✅ **User Registration Route**

//admin
router.get('/admin', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from database
        res.render('admin', { users }); // Pass users to EJS
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});


// ✅ **User Login Route**
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     const sql = "SELECT * FROM users WHERE email = ?";
//     db.query(sql, [email], async (err, results) => {
//         if (err) return res.status(500).send('Database error');
//         if (results.length === 0) return res.status(400).send('User not found');

//         const user = results[0];
//         const match = await bcrypt.compare(password, user.password);

//         if (!match) return res.status(400).send('Incorrect password');

//         req.session.user = user;
//         res.send('Login successful');
//     });
// });
// 🔹 Login Route (MongoDB + Mongoose)  change on 19-03-2025 by krish
app.post('/login', async (req, res) => { 
    try {
        const { email, password } = req.body;

        // 🛑 Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required!" });
        }

        // 🔍 Find user by email in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        // 🔑 Compare hashed passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "❌ Incorrect password!" });
        }

        // ✅ Set session & return success response
        req.session.user = user;
        res.status(200).json({ message: "✅ Login successful!" });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
    }
});

// Route to render assign user page
app.get('/assignuser', (req, res) => {
    const sql = "SELECT id, username, email FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send("Database error!");
        }
        res.render('assignuser', { users: results });
    });
});

// API to assign user
app.post('/assignUser', (req, res) => {
    const { userId, assignStatus } = req.body;

    const sql = "UPDATE users SET isAssigned = ? WHERE id = ?";
    db.query(sql, [assignStatus, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error!" });
        }
        res.json({ message: "User assigned successfully!" });
    });
});

// // ✅ Admin Login Route
// app.post('/login', (req, res) => {  // 🔹 FIXED: Changed '/views/admin' to '/login'
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//         return res.status(400).send("❌ Email and password are required.");
//     }

//     const sql = "SELECT * FROM users WHERE email = ? AND user_group = 'Admin'";
    
//     db.query(sql, [email], (err, results) => {
//         if (err) {
//             console.error("❌ Database Error:", err);
//             return res.status(500).send("❌ Database error! Try again.");
//         }

//         if (results.length === 0) {
//             return res.status(401).send("❌ Invalid credentials or not an admin.");
//         }

//         const user = results[0];

//         // 🔹 FIXED: Use `compareSync()` inside the callback
//         if (!bcrypt.compareSync(password, user.password)) {
//             return res.status(401).send("❌ Invalid credentials.");
//         }

//         // ✅ Store Minimal User Data in Session
//         req.session.user = {
//             id: user.id,
//             username: user.username,
//             email: user.email,
//             user_group: user.user_group
//         };

//         res.redirect('/admin');
//     });
// });

// ✅ Admin Login Route (MongoDB + Mongoose)  change on 19-03-2025 by krish
app.post('/login', async (req, res) => {  
    try {
        const { email, password } = req.body;

        // 🛑 Validate Input
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required." });
        }

        // 🔍 Find admin user in MongoDB
        const user = await User.findOne({ email, user_group: 'Admin' });
        if (!user) {
            return res.status(401).json({ message: "❌ Invalid credentials or not an admin." });
        }

        // 🔑 Compare hashed passwords
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid credentials." });
        }

        // ✅ Store Minimal User Data in Session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            user_group: user.user_group
        };

        res.redirect('/admin'); // Redirect to admin panel

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
    }
});

// // ✅ Admin Dashboard Route
// app.get('/admin', (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login');
//     }

//     if (req.session.user.user_group === "Admin") {
//         const sql = "SELECT id, username, email FROM user";
//         db.query(sql, (err, results) => {
//             if (err) {
//                 console.error("❌ Database error:", err);
//                 return res.status(500).send("❌ Database error! Try again.");
//             }
//             return res.render('admin', { user: req.session.user, users: results });
//         });
//     } else {
//         return res.status(403).send("❌ Access Denied");
//     }
// });
// ✅ Admin Dashboard Route (MongoDB + Mongoose)   change on 19-03-2025 by krish
app.get('/admin', async (req, res) => {
    try {
        // 🔑 Check if user is logged in
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // 🔍 Verify if user is an Admin
        if (req.session.user.user_group !== "Admin") {
            return res.status(403).send("❌ Access Denied");
        }

        // 📌 Fetch all users (id, username, email) from MongoDB
        const users = await User.find({}, "id username email");

        // 🎨 Render admin dashboard with user data
        res.render('admin', { user: req.session.user, users });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});


// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mohan@gmail.com',
        pass: '12345'
    }
});

// Step 1: Request password reset
app.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '❌ Email not found!' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour expiration

        await db.query('UPDATE users SET reset_token=?, reset_expires=? WHERE email=?', [token, expires, email]);

        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`
        });

        res.json({ message: '📩 Reset link sent! Check your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '❌ Error processing request.' });
    }
});

// Step 2: Verify Token & Allow Password Reset
app.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE reset_token=? AND reset_expires > NOW()', [token]);
        if (rows.length === 0) {
            return res.status(400).send('❌ Invalid or expired token.');
        }

        res.render('new-password', { token });
    } catch (error) {
        console.error(error);
        res.status(500).send('❌ Error loading reset page.');
    }
});

// Step 3: Save New Password
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE reset_token=? AND reset_expires > NOW()', [token]);
        if (rows.length === 0) {
            return res.status(400).json({ message: '❌ Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password=?, reset_token=NULL, reset_expires=NULL WHERE reset_token=?', [hashedPassword, token]);

        res.json({ success: true, message: '✅ Password reset successfully! You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '❌ Error resetting password.' });
    }
});

//Define-routes
app.get('/forget-password', (_, res) => res.render('forget-password'));
// app.get('/manageuser/add_user', (_, res) => res.render('manageuser/add_user'));

// 🔵 **Fix the User Creation Route**
app.post("/manageuser/add_user", async (req, res) => {
    try {
        const { user_group, store, username, email, password, phone } = req.body;

        if (!user_group || !store || !username || !email || !password || !phone) {
            return res.status(400).json({ message: "❌ All fields are required!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            user_group,
            store,
            username,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();
        res.status(201).json({ message: "✅ User added successfully!" });

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
    }
});


router.post('/add_user', async (req, res) => {
    console.log("📥 Received data from frontend:", req.body);  // Debugging log

    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send("User created successfully!");
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(400).send(error.message);
    }
});

// ✅ Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
