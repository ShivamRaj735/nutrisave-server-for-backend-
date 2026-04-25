const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Get all available food listings
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    else filter.status = 'available';
    if (category) filter.category = category;

    const foods = await Food.find(filter).sort({ createdAt: -1 }).populate('donor', 'name role phone');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my donations (donor)
router.get('/my', auth, async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user.id }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add food donation
router.post('/', auth, async (req, res) => {
  try {
    const { foodName, quantity, quantityUnit, category, description, pickupAddress, pickupTime, expiryTime } = req.body;
    const food = new Food({
      donor: req.user.id,
      donorName: req.user.name,
      donorRole: req.user.role,
      foodName, quantity, quantityUnit, category, description,
      pickupAddress, pickupTime, expiryTime
    });
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update food status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Not found' });
    food.status = req.body.status;
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete food listing
router.delete('/:id', auth, async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
