// models/User.js
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: String,
    companyName: String,
    googleId: String,
    password: String,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
