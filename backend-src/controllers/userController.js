const UserService = require('../services/userService');
const { ValidationError, DatabaseError } = require('../utils/errors');
const logger = require('../utils/logger');

const getConnectedUsers = async (req, res) => {
    try {
        const connectedUsers = await UserService.getConnectedUsers();
        res.status(200).json(connectedUsers);
    } catch (error) {
        logger.error('Error getting connected users:', error);
        if (error instanceof DatabaseError) {
            return res.status(503).json({ 
                message: 'Service temporarily unavailable',
                error: 'database_error'
            });
        }
        res.status(500).json({ 
            message: 'Internal server error',
            error: 'server_error'
        });
    }
};

const getUserBalance = async (req, res) => {
    try {
        const userId = req.user?.id; // Assuming auth middleware sets req.user

        if (!userId) {
            return res.status(401).json({ 
                message: 'Authentication required',
                error: 'unauthorized'
            });
        }

        const balance = await UserService.getUserBalance(userId);
        
        if (balance === null) {
            return res.status(404).json({
                message: 'User balance not found',
                error: 'not_found'
            });
        }

        res.status(200).json({ balance });
    } catch (error) {
        logger.error('Error getting user balance:', error);
        
        if (error instanceof ValidationError) {
            return res.status(400).json({
                message: error.message,
                error: 'validation_error'
            });
        }
        
        if (error instanceof DatabaseError) {
            return res.status(503).json({
                message: 'Service temporarily unavailable',
                error: 'database_error'
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            error: 'server_error'
        });
    }
};

module.exports = {
    getConnectedUsers,
    getUserBalance,
};