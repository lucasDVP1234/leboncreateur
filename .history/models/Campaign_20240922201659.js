// models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    creatorId: mongoose.Schema.Types.ObjectId,
    schedule: String,
    status: String,
});

module.exports = mongoose.model('Campaign', campaignSchema);
