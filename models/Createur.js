// models/Creator.js
const mongoose = require('mongoose');

const createurSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true, // Enforce uniqueness
    },
    password: String,
    number: String,
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    genre: String,
    age: Number,
    category: [String],
    videoTypes: [String],
    profileImage: String,
    portfolioImages: [String],
    description: String,
    country : String,
    langue : [String],
    atout :[String],
    videos :[String],
    marqueLogo :[String],
    videoPrice : Number,
    insta :String,
    pseudo: {
        type: String,
        required: true,
        unique: true, // Enforce uniqueness
    },
    shownum :{
        type: Boolean,
        default: true,
      },
    showemail :{
        type: Boolean,
        default: true,
      },
    isCardActive: {
        type: Boolean,
        default: false,
      },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets to current date/time on creation
    },

});

module.exports = mongoose.model('Createur', createurSchema);


