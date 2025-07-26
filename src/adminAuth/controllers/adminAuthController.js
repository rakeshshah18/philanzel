import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class AdminAuthController {
    // Register new admin
    async register(req, res) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { name, email, password, role } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(409).json({
                    success: false,
                    message: 'Admin with this email already exists'
                });
            }

            // Create new admin
            const admin = new Admin({
                name,
                email,
                password,
                role: role || 'admin'
            });

            await admin.save();

            // Generate tokens
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();

            // Save refresh token
            admin.refreshToken = refreshToken;
            await admin.save();

            // Set cookie for refresh token
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                data: {
                    admin,
                    accessToken
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Login admin
    async login(req, res) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;

            // Find admin by email
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if admin is active
            if (!admin.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated. Please contact super admin.'
                });
            }

            // Check password
            const isPasswordValid = await admin.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate tokens
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();

            // Save refresh token and update last login
            admin.refreshToken = refreshToken;
            await admin.updateLastLogin();

            // Set cookie for refresh token
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    admin,
                    accessToken
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Refresh access token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token not provided'
                });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');

            // Find admin
            const admin = await Admin.findById(decoded.id);
            if (!admin || admin.refreshToken !== refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }

            // Generate new access token
            const newAccessToken = admin.generateAccessToken();

            res.status(200).json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: newAccessToken
                }
            });

        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }
    }

    // Logout admin
    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (refreshToken) {
                // Remove refresh token from database
                await Admin.findOneAndUpdate(
                    { refreshToken },
                    { refreshToken: null }
                );
            }

            // Clear cookie
            res.clearCookie('refreshToken');

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Get current admin profile
    async getProfile(req, res) {
        try {
            const admin = await Admin.findById(req.admin.id);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            res.status(200).json({
                success: true,
                data: admin
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Update admin profile
    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { name, email } = req.body;
            const adminId = req.admin.id;

            // Check if email is already taken by another admin
            if (email) {
                const existingAdmin = await Admin.findOne({
                    email,
                    _id: { $ne: adminId }
                });

                if (existingAdmin) {
                    return res.status(409).json({
                        success: false,
                        message: 'Email is already taken'
                    });
                }
            }

            // Update admin
            const updatedAdmin = await Admin.findByIdAndUpdate(
                adminId,
                { name, email },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedAdmin
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { currentPassword, newPassword } = req.body;
            const adminId = req.admin.id;

            // Find admin
            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            admin.password = newPassword;
            await admin.save();

            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    // Get all admins (super admin only)
    async getAllAdmins(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;

            const query = {};
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { createdAt: -1 }
            };

            const admins = await Admin.find(query)
                .select('-password -refreshToken')
                .sort(options.sort)
                .limit(options.limit * 1)
                .skip((options.page - 1) * options.limit);

            const total = await Admin.countDocuments(query);

            res.status(200).json({
                success: true,
                data: {
                    admins,
                    pagination: {
                        page: options.page,
                        limit: options.limit,
                        total,
                        pages: Math.ceil(total / options.limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get all admins error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default new AdminAuthController();
