const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

// Crear intento de pago para depósito
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (amount < 5) {
      return res.status(400).json({
        message: 'El monto mínimo de depósito es $5',
        error: 'invalid_amount'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe usa centavos
      currency: 'usd',
      metadata: {
        userId: req.user.userId,
        type: 'deposit'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    logger.error('Error al crear intento de pago:', error);
    res.status(500).json({
      message: 'Error al procesar el pago',
      error: 'payment_error'
    });
  }
});

// Webhook para procesar eventos de Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        const amount = paymentIntent.amount / 100;
        const type = paymentIntent.metadata.type;

        const user = await User.findById(userId);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        if (type === 'deposit') {
          user.balance += amount;
        }

        await user.save();
        break;

      case 'payment_intent.payment_failed':
        // Manejar fallo de pago
        break;
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Error en webhook:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Iniciar retiro con Stripe Connect
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount, accountId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({
        message: 'Balance insuficiente',
        error: 'insufficient_balance'
      });
    }

    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: 'usd',
      destination: accountId,
      metadata: {
        userId,
        type: 'withdrawal'
      }
    });

    user.balance -= amount;
    await user.save();

    res.json({ transfer });
  } catch (error) {
    logger.error('Error al procesar retiro:', error);
    res.status(500).json({
      message: 'Error al procesar el retiro',
      error: 'withdrawal_error'
    });
  }
});

module.exports = router;