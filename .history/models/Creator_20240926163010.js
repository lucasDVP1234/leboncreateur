// models/Creator.js
const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    category: String,
    videoTypes: [String],
    profileImage: String,
    portfolioImages: String]
    description: String,
});

module.exports = mongoose.model('Creator', creatorSchema);


