const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const User = require('../models/User');
const Request = require('../models/Request');

router.get('/stats', async (req, res) => {
  try {
    const [totalDonations, delivered, available, totalUsers, totalRequests] = await Promise.all([
      Food.countDocuments(),
      Food.countDocuments({ status: 'delivered' }),
      Food.countDocuments({ status: 'available' }),
      User.countDocuments(),
      Request.countDocuments()
    ]);
    res.json({ totalDonations, delivered, available, totalUsers, totalRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
