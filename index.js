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
const MongoStore = require('connect-mongo'); //Mohan
const jwt = require('jsonwebtoken');
// const deleteUserRoute = require('./routes/delete_user'); 
const storeRoutes = require('./routes/store'); // Import store routes write on 26 march by krishna
const vnocRoutes = require('./routes/vnoc'); // Import store routes write on 26 march by krishna



const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; // Assuming token is stored in cookies
    if (!token) return res.redirect('/login');

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
};

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

//Routes Middleware

// Routes
app.use("/vnoc", vnocRoutes);
app.use("/auth", require("./routes/auth")); // Ensure this path is correct
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
    secret: 'your-secret-key',  // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Use true if using HTTPS
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/vcms',  // Change to your actual DB
        collectionName: 'sessions'
    }),
    cookie: {
        secure: false,  // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60  // 1 hour session
    }
}));
 app.use(storeRoutes);  //write on 26 march by krishna
 app.use(vnocRoutes);
 // Serve static files (CSS, JS)
app.use(express.static('public'));   //write on 26 march by krishna




// Import Routes change on 21 march by krishna 
const deleteUserRoute = require("./routes/delete_user");
app.use("/", deleteUserRoute); // w o 21-03-25
app.use(deleteUserRoute);

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
// app.get('/admin', (_, res) => 
//     res.render('admin'));
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
//user-dashboard
app.get('/user-dashboard', (_, res) => 
    res.render('user-dashboard'));
// admin-dashboard 22 march by krishna
app.get('/admin-dashboard', (_, res) => 
    res.render('admin-dashboard'));
// write on 22 march by krishna
  app.get('/store', (_, res) => 
    res.render('store'));
  // Default Route (Redirect to VNOC Dashboard)
  app.get("/vnoc", (req, res) => {
    res.render("vnoc", { title: "VNOC Dashboard" });
});



//routes
app.use('/manageuser', addUserRoute);


// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // ✅ User is authenticated, continue to the next middleware
    } else {
        return res.redirect('/login'); // 🔒 Redirect to login page if not logged in
    }
}

// login deatail here 
// 26 march 

// ✅ Login Route (Fixed)
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🛑 Validate Input
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required." });
        }

        // 🔍 Find user in MongoDB
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        // 🔑 Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid email or password." });
        }

        // ✅ Store User Session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            user_group: user.user_group.toLowerCase()
        };

        console.log("✅ User Logged In:", req.session.user);

        // ✅ Send user_group so frontend can redirect
        return res.status(200).json({
            message: "✅ Login successful!",
            user_group: req.session.user.user_group
        });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ message: "❌ Internal Server Error. Please try again." });
    }
});


// 🏠 Dashboard Route
app.get('/store', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');  // Redirect if not logged in
    }
    
    // Example VC sessions data (Replace with actual DB query)
    const vcSessions = [];  // Example: await VCSessions.findAll()

    res.render('store', { user: req.session.user, vcSessions });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).send("Invalid credentials");
        }

        req.session.user = user;  // ✅ Store user in session
        res.redirect('/store');   // ✅ Redirect to store after login
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal Server Error");
    }
});

// write on 24 marchh by krishna
app.get('/vnoc', async (req, res) => { 
    try {
        // Fetch bookings from MongoDB
        const bookings = await VCBooking.find(); // Get all bookings

        console.log("Bookings fetched:", bookings); // Debugging log

        res.render('vnoc', { bookings }); // Pass bookings to EJS template
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error fetching bookings");
    }
});

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


// ✅ Updated on 24-03-2025 by Krishna
app.get('/admin', isAuthenticated, async (req, res) => { 
    try {
        console.log("🔍 Checking Session User:", req.session.user); // Debugging log

        // Ensure the user is authenticated
        if (!req.session.user) {
            console.log("❌ No user found in session. Redirecting to login.");
            return res.redirect('/login'); // Redirect to login if no session
        }

        const user = req.session.user;

        console.log("🎯 User Role:", user.user_group); // Log user role
        console.log("🧐 Type of user_group:", typeof user.user_group); // Debugging type

        // Ensure user_group is a valid string
        if (!user.user_group || typeof user.user_group !== 'string') {
            console.log("❌ Invalid or missing user_group.");
            return res.status(403).send("❌ Access Denied - Invalid user role.");
        }

        // Convert user role to lowercase for case-insensitive matching
        const role = user.user_group.toLowerCase();

        // 🎯 Redirect based on user role
        switch (role) {
            case "admin":
                const users = await User.find({}, "id username email"); // Fetch users for admin
                return res.render('admin', { user, users }); // ✅ Render admin.ejs
            case "store":
                const storeUsers = await User.find({}, "id username email");
                return res.render('store', { user, users: storeUsers }); // ✅ Render store.ejs
            case "vnoc":
                return res.render('vnoc', { user }); // ✅ Render vnoc.ejs
            default:
                console.log("⚠️ Unknown user role detected:", user.user_group);
                return res.status(403).send(`❌ Access Denied - Unknown role: ${user.user_group}`);
        }
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});



// only for check by krishna on 22 march
router.get('/store', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from database
        res.render('store', { users }); // Pass users to EJS
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});
//only for check by krishna on 22 march
app.get('/store', isAuthenticated, async (req, res) => { 
    try {
        // Ensure the user is authenticated
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if no session
        }

        const user = req.session.user;

        // ✅ If user_group = "store", render store.ejs
        if (user.user_group.toLowerCase() === "store") {
            return res.render('store', { user }); 
        }

        // ✅ If user_group = "admin", render admin.ejs
        if (user.user_group.toLowerCase() === "admin") {
            const users = await User.find({}, "id username email");
            return res.render('admin', { user, users });
        }

        // ❌ If user has an unknown role, deny access
        return res.status(403).send("❌ Access Denied - Unknown Role");

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).send("❌ Database error! Try again.");
    }
});
app.get('/store', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }

    res.render('store', { user: req.session.user }); // Pass user data to store.ejs
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
//Login authication
const authenticateUser = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    next();
};

app.use('/admin', authenticateUser);

// ✅ DELETE user from MongoDB  change on 20-03-2025
router.delete("/delete_user", async (req, res) => {   // deltet-user to delete_usero on 21 march
    try {
        const { userIdentifier } = req.body;

        if (!userIdentifier) {
            return res.status(400).json({ message: "❌ User ID or Email is required!" });
        }

        // ✅ Find and delete user by ID or Email
        const result = await User.deleteOne({
            $or: [{ _id: userIdentifier }, { email: userIdentifier }]
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "❌ User not found!" });
        }

        res.status(200).json({ message: "✅ User deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
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

router.post('/add_user', async (req, res) => {
    try {
        const { user_group, store, username, email, phone, status, password, confirmPassword } = req.body;

        // ✅ Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "❌ Passwords do not match. Please try again!" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "⚠️ User already exists." });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user
        const newUser = new User({
            user_group,
            store,
            username,
            email,
            phone,
            status,
            password: hashedPassword,
        });

        // ✅ Save user to database
        await newUser.save();

        // ✅ Return success message with Login Button
        res.status(201).send(`
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h2 style="color: green;">✅ User created successfully!</h2>
                <p>You can now log in using your credentials.</p>
                <a href="/login" style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                    🔑 Login Now
                </a>
            </div>
        `);

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "🚨 Internal Server Error. Please try again." });
    }
});



// write on 24 march by krishna

// 🔹 Define VNOC Route Here
app.get("/vnoc", async (req, res) => {
    try {
        // Fetch booking data from MongoDB
        const pendingBookings = await VCBooking.countDocuments({ status: "pending" });
        const approvedBookings = await VCBooking.countDocuments({ status: "approved" });
        const rejectedBookings = await VCBooking.countDocuments({ status: "rejected" });

        // Render the VNOC page with the data
        res.render("vnoc", {
            pendingBookings,
            approvedBookings,
            rejectedBookings
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Internal Server Error");
    }
});



// booking by krishna on 25 march 

// Define Schema
const vcBookingSchema = new mongoose.Schema({
    companyName: String,
    chairperson: String,
    designation: String,
    contactNumber: String,
    email: String,
    bookedBy: String,
    vcPurpose: String,
    remark: String,
    vcDuration: Number,
    vcStartDate: Date,
    vcEndDate: Date,
    status: { type: String, default: "Pending" }
});


// Prevent model re-compilation
const VCBooking = mongoose.models.VCBooking || mongoose.model("VCBooking", vcBookingSchema);

// Handle Form Submission
app.post("/bookVC", async (req, res) => {
    try {
        const newBooking = new VCBooking({
            companyName: req.body.companyName,
            chairperson: req.body.chairperson,
            designation: req.body.designation,
            contactNumber: req.body.contactNumber,
            email: req.body.email,
            bookedBy: req.body.bookedBy,
            vcPurpose: req.body.vcPurpose,
            remark: req.body.remark,
            vcDuration: req.body.vcDuration,
            vcStartDate: req.body.vcStartDate,
            vcEndDate: req.body.vcEndDate
        });

        await newBooking.save();
        // res.send("VC Booking Successful! <a href='/store'>Go Back</a>");
         // Send success message with a 'Go Back' link
         res.send(`
            <script>
                alert("✅ VC Booking Successful!");
                window.location.href = "/store"; // Redirect back to store page
            </script>
        `);
        
    } catch (err) {
        console.error(err);
        res.send("Error saving data.");
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
