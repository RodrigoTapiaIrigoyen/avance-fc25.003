const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'auth_required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required',
        error: 'forbidden'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Admin authentication error:', error);
    res.status(401).json({
      message: 'Invalid or expired token',
      error: 'invalid_token'
    });
  }
};