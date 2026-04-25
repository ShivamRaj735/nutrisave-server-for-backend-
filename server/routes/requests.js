const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Food = require('../models/Food');
const auth = require('../middleware/auth');

// Request a food pickup
router.post('/', auth, async (req, res) => {
  try {
    const { foodId, notes } = req.body;
    const food = await Food.findById(foodId);
    if (!food || food.status !== 'available') return res.status(400).json({ message: 'Food not available' });

    const existing = await Request.findOne({ food: foodId, requester: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already requested' });

    const request = new Request({
      food: foodId,
      requester: req.user.id,
      requesterName: req.user.name,
      requesterRole: req.user.role,
      notes
    });
    await request.save();

    food.status = 'requested';
    food.requestedBy = req.user.id;
    await food.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my requests (NGO/volunteer)
router.get('/my', auth, async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user.id })
      .populate('food')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get requests for my donations (donor)
router.get('/incoming', auth, async (req, res) => {
  try {
    const myFoods = await Food.find({ donor: req.user.id });
    const foodIds = myFoods.map(f => f._id);
    const requests = await Request.find({ food: { $in: foodIds } })
      .populate('food')
      .populate('requester', 'name role phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update request status
router.patch('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    request.status = req.body.status;
    await request.save();

    if (req.body.status === 'delivered') {
      await Food.findByIdAndUpdate(request.food, { status: 'delivered' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
