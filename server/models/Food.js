const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  donorRole: { type: String },
  foodName: { type: String, required: true },
  quantity: { type: String, required: true },
  quantityUnit: { type: String, default: 'kg' },
  category: {
    type: String,
    enum: ['cooked', 'raw', 'packaged', 'bakery', 'fruits_veggies', 'other'],
    default: 'cooked'
  },
  description: { type: String },
  pickupAddress: { type: String, required: true },
  pickupTime: { type: Date, required: true },
  expiryTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['available', 'requested', 'picked_up', 'delivered', 'expired'],
    default: 'available'
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
