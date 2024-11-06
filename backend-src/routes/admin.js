const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const logger = require('../utils/logger');

// Get admin statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const withdrawals = await Withdrawal.aggregate([
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: '$amount' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const deposits = await User.aggregate([
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: '$balance' }
        }
      }
    ]);

    res.json({
      activeUsers,
      totalWithdrawals: withdrawals[0]?.totalWithdrawals || 0,
      pendingWithdrawals: withdrawals[0]?.pendingCount || 0,
      totalDeposits: deposits[0]?.totalDeposits || 0
    });
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: 'server_error'
    });
  }
});

// Get user list with pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Error fetching users',
      error: 'server_error'
    });
  }
});

// Update user status
router.patch('/users/:userId/status', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        error: 'invalid_status'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'user_not_found'
      });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({
      message: 'Error updating user',
      error: 'server_error'
    });
  }
});

// Handle withdrawal approval/rejection
router.patch('/withdrawals/:withdrawalId', adminAuth, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, reason } = req.body;

    if (!['completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        error: 'invalid_status'
      });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({
        message: 'Withdrawal not found',
        error: 'withdrawal_not_found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        message: 'Withdrawal already processed',
        error: 'already_processed'
      });
    }

    withdrawal.status = status;
    if (status === 'rejected') {
      withdrawal.rejectionReason = reason;
      // Return funds to user
      const user = await User.findById(withdrawal.userId);
      user.balance += withdrawal.amount;
      await user.save();
    }

    await withdrawal.save();
    res.json(withdrawal);
  } catch (error) {
    logger.error('Error processing withdrawal:', error);
    res.status(500).json({
      message: 'Error processing withdrawal',
      error: 'server_error'
    });
  }
});

module.exports = router;