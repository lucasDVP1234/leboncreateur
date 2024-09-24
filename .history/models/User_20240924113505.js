// models/User.js
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Enforce uniqueness
    },
    companyName: String,
    googleId: String,
    password: String,
    job:
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
