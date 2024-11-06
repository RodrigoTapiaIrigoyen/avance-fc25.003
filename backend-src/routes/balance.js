const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

// Obtener balance del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('balance');
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
        error: 'user_not_found'
      });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    logger.error('Error al obtener balance:', error);
    res.status(500).json({
      message: 'Error al obtener el balance',
      error: 'server_error'
    });
  }
});

module.exports = router;