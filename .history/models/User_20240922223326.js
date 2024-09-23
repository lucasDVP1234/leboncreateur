// models/User.js
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: String,
    companyName: String,
    googleId: String,
    password: String, // We'll store the hashed password here
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
