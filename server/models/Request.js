const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requesterName: { type: String },
  requesterRole: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'picked_up', 'delivered'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
