const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('balance');
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'user_not_found'
      });
    }

    res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({
      message: 'Error retrieving balance',
      error: 'server_error'
    });
  }
});

module.exports = router;