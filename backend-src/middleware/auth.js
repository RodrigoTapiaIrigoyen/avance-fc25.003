const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'No se proporcionó token de autenticación',
        error: 'auth_required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    logger.error('Error de autenticación:', error);
    res.status(401).json({
      message: 'Token inválido o expirado',
      error: 'invalid_token'
    });
  }
};