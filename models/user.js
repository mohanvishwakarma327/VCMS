const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_group: { type: String, required: true },
    store: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
