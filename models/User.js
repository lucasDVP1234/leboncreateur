// models/User.js
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Enforce uniqueness
    },
    name: String,
    surname: String,
    number: String,
    companyName: {
        type: String,
        required: true,
    },
    googleId: String,
    password: String,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    job:String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
