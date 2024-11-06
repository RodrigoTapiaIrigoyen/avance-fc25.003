const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.get('/connected', authMiddleware, async (req, res) => {
  try {
    const connectedUsers = await User.find({
      isOnline: true,
      lastActive: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    }).select('username lastActive');

    res.status(200).json(connectedUsers);
  } catch (error) {
    console.error('Error getting connected users:', error);
    res.status(500).json({
      message: 'Error retrieving connected users',
      error: 'server_error'
    });
  }
});

module.exports = router;