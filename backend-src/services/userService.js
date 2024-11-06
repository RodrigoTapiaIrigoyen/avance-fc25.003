const { DatabaseError, ValidationError } = require('../utils/errors');
const db = require('../config/database');
const logger = require('../utils/logger');

class UserService {
    static async getConnectedUsers() {
        try {
            const query = `
                SELECT id, username, last_active
                FROM users
                WHERE last_active > NOW() - INTERVAL '5 minutes'
                AND is_online = true
            `;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            logger.error('Database error in getConnectedUsers:', error);
            throw new DatabaseError('Failed to fetch connected users');
        }
    }

    static async getUserBalance(userId) {
        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        try {
            const query = `
                SELECT balance 
                FROM user_balances 
                WHERE user_id = $1
            `;
            const result = await db.query(query, [userId]);
            
            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0].balance;
        } catch (error) {
            logger.error('Database error in getUserBalance:', error);
            throw new DatabaseError('Failed to fetch user balance');
        }
    }
}

module.exports = UserService;