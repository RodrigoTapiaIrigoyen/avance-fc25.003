const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const logger = require('../utils/logger');

// Obtener retiros del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    logger.error('Error al obtener retiros:', error);
    res.status(500).json({
      message: 'Error al obtener los retiros',
      error: 'server_error'
    });
  }
});

// Solicitar un retiro
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, method } = req.body;
    const userId = req.user.userId;

    // Validar monto mínimo
    if (amount < 10) {
      return res.status(400).json({
        message: 'El monto mínimo de retiro es $10',
        error: 'invalid_amount'
      });
    }

    // Verificar balance disponible
    const user = await User.findById(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({
        message: 'Balance insuficiente',
        error: 'insufficient_balance'
      });
    }

    // Crear retiro y actualizar balance
    const withdrawal = new Withdrawal({
      userId,
      amount,
      method
    });

    user.balance -= amount;
    
    await withdrawal.save();
    await user.save();

    res.status(201).json(withdrawal);
  } catch (error) {
    logger.error('Error al procesar retiro:', error);
    res.status(500).json({
      message: 'Error al procesar el retiro',
      error: 'server_error'
    });
  }
});

module.exports = router;