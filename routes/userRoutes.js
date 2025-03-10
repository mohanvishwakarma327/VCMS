const express = require('express');
const router = express.Router();

// Middleware to parse JSON requests (ensure this is in your main index.js too)
router.use(express.json());

// Example route - Get all users
router.get('/', (_, res) => {
    res.send('User Routes Working!');
});

// Example route - Get a specific user by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Fetching details for user with ID: ${userId}` });
});

// Route - Create a new user (handling errors)
router.post('/add_user', (req, res) => {
    try {
        const { userGroup, circle, username, email, mobileNumber, status, password } = req.body;

        // Basic validation (ensure required fields exist)
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, Email, and Password are required!' });
        }

        // Simulating user creation (Replace with actual database logic)
        const newUser = { userGroup, circle, username, email, mobileNumber, status, password };

        console.log('New User:', newUser); // Logs the user data
        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
