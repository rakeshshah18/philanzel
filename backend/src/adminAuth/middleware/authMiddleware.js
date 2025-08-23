import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        // Check if JWT secret is configured
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        if (!accessSecret) {
            console.error('JWT_ACCESS_SECRET environment variable is not set');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Check blacklist
        const { isTokenBlacklisted } = await import('../utils/tokenBlacklist.js');
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({
                success: false,
                message: 'Token has been revoked. Please login again.',
                error: 'TOKEN_BLACKLISTED'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, accessSecret);
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);

            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired',
                    error: 'TOKEN_EXPIRED'
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    error: 'TOKEN_INVALID'
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Token verification failed',
                    error: 'TOKEN_ERROR'
                });
            }
        }

        // Check if admin exists and is active
        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or inactive account'
            });
        }

        // Add admin info to request
        req.admin = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };

        next();

    } catch (error) {
        console.error('Token verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Token verification failed'
        });
    }
};

// Check if admin has required role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const adminRole = req.admin.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(adminRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Super admin only middleware
const requireSuperAdmin = requireRole('super_admin');

// Admin or super admin middleware
const requireAdmin = requireRole(['admin', 'super_admin']);

export {
    verifyToken,
    requireRole,
    requireSuperAdmin,
    requireAdmin
};
