import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
    console.log('--- verifyToken: Incoming request headers ---');
    console.log(req.headers);
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        console.log('--- verifyToken middleware ---');
        console.log('Authorization header:', authHeader);
        console.log('Extracted token:', token);

        if (!token) {
            console.log('No access token provided');
            return res.status(401).json({
                success: false,
                message: 'Access token required',
                debug: 'No token in Authorization header'
            });
        }

        // Check if JWT secret is configured
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        if (!accessSecret) {
            console.error('JWT_ACCESS_SECRET environment variable is not set');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                debug: 'Missing JWT_ACCESS_SECRET env var'
            });
        }

        // Check blacklist
        const { isTokenBlacklisted } = await import('../utils/tokenBlacklist.js');
        if (isTokenBlacklisted(token)) {
            console.log('Token is blacklisted');
            return res.status(401).json({
                success: false,
                message: 'Token has been revoked. Please login again.',
                error: 'TOKEN_BLACKLISTED',
                debug: 'Token found in blacklist'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, accessSecret);
            console.log('Decoded JWT payload:', decoded);
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);

            if (jwtError.name === 'TokenExpiredError') {
                console.log('Token expired');
                return res.status(401).json({
                    success: false,
                    message: 'Token expired',
                    error: 'TOKEN_EXPIRED',
                    debug: 'JWT token expired'
                });
            } else if (jwtError.name === 'JsonWebTokenError') {
                console.log('Invalid JWT token');
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    error: 'TOKEN_INVALID',
                    debug: 'JWT token invalid'
                });
            } else {
                console.log('Token verification failed for unknown reason');
                return res.status(401).json({
                    success: false,
                    message: 'Token verification failed',
                    error: 'TOKEN_ERROR',
                    debug: jwtError.message
                });
            }
        }

        // Check if admin exists and is active
        const admin = await Admin.findById(decoded.id);
        if (!admin || !admin.isActive) {
            console.log('Admin not found or inactive for token:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Invalid token or inactive account',
                debug: 'Admin not found or inactive',
                adminId: decoded.id
            });
        }

        // Add admin info to request
        req.admin = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };
        console.log('Token verified, admin:', req.admin);

        console.log('Token verified, admin:', req.admin);
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
        console.log('--- requireRole middleware ---');
        console.log('req.admin:', req.admin);
        const adminRole = req.admin ? req.admin.role : null;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        console.log('Required roles:', allowedRoles, 'Admin role:', adminRole);
        if (!req.admin) {
            console.log('requireRole: req.admin missing, sending 401');
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
                debug: 'requireRole: req.admin missing'
            });
        }
        if (!allowedRoles.includes(adminRole)) {
            console.log('requireRole: insufficient permissions, sending 403');
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
                debug: 'requireRole: role not allowed',
                adminRole,
                allowedRoles
            });
        }
        console.log('requireRole: role allowed, proceeding');
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
    requireAdmin,
};
