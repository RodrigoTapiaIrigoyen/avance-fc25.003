const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const withdrawalRoutes = require('./routes/withdrawals');
const balanceRoutes = require('./routes/balance');
const paymentRoutes = require('./routes/payments');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('MongoDB connected successfully');
}).catch((err) => {
  logger.error('MongoDB connection error:', err);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Webhook must be before express.json()
app.use('/api/payments/webhook', paymentRoutes);

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});