const express = require('express');
const app = express();
const deleteUserRoutes = require('./routes'); // Adjust path accordingly
app.use("/vnoc", require("./routes/vnoc"));


app.use(express.json()); // Middleware to parse JSON
app.use(deleteUserRoutes); // Register the delete-user route

app.listen(5502, () => console.log('Server running on port 5502'));
