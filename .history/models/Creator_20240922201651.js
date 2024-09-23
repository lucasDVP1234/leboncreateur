// models/Creator.js
const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
    name: String,
    category: String,
    profileImage: String,
    description: String,
});

module.exports = mongoose.model('Creator', creatorSchema);
