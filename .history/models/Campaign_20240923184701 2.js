const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creatorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }], // Note the array []
  status: String,
});

module.exports = mongoose.model('Campaign', campaignSchema);