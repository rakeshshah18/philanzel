import User from '../../models/users/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            investmentExperience,
            password,
            confirmPassword,
            termsAccepted,
            receiveUpdates
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phone || !investmentExperience || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        // Check password strength
        if (password.length < 8) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long'
            });
        }

        // Check if terms are accepted
        if (!termsAccepted) {
            return res.status(400).json({
                status: 'error',
                message: 'You must accept the terms of service'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        // Capitalize first letter of investment experience for consistency
        const normalizedExperience = investmentExperience.charAt(0).toUpperCase() + investmentExperience.slice(1).toLowerCase();

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            investmentExperience: normalizedExperience,
            password,
            termsAccepted,
            receiveUpdates: receiveUpdates || false
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    investmentExperience: user.investmentExperience
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                status: 'error',
                message: messages.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Check if user exists (include password for comparison)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Update last login - bypass validation
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    investmentExperience: user.investmentExperience
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error during login'
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No user found with this email address'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token expiry (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create reset URL - use frontend URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // TODO: Send email with reset link
        // For now, just return success message

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to email',
            // Remove these in production - only for testing
            ...(process.env.NODE_ENV === 'development' && {
                resetToken: resetToken,
                resetUrl: resetUrl
            })
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error'
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const { token } = req.params;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide password and confirm password'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long'
            });
        }

        // Hash token from params
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired reset token'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate new token
        const authToken = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Password reset successful',
            data: {
                token: authToken
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    investmentExperience: user.investmentExperience,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, investmentExperience } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        if (investmentExperience) {
            const normalized = investmentExperience.charAt(0).toUpperCase() + investmentExperience.slice(1).toLowerCase();
            user.investmentExperience = normalized;
        }

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    investmentExperience: user.investmentExperience
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Server error'
        });
    }
};

// ============================================
// MIDDLEWARE - user.js
// ============================================

// This should be in src/middlewares/user.js
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
