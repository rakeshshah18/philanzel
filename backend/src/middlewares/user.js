// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/users/userModel.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error'
        });
    }
};