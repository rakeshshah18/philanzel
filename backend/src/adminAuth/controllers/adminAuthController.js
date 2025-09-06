import { generateOTP, saveOTP, verifyOTP } from '../utils/otpStore.js';
import { sendMail } from '../utils/mailer.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

class AdminAuthController {
    async deleteAdmin(req, res) {
        try {
            const { id } = req.params;
            const requestingAdmin = req.admin; // set by verifyToken
            if (!requestingAdmin || requestingAdmin.role !== 'super_admin') {
                return res.status(403).json({ success: false, message: 'Only super admin can delete admins.' });
            }
            if (requestingAdmin.id.toString() === id) {
                return res.status(400).json({ success: false, message: 'Super admin cannot delete themselves.' });
            }
            const adminToDelete = await Admin.findById(id);
            if (!adminToDelete) {
                return res.status(404).json({ success: false, message: 'Admin not found.' });
            }
            if (adminToDelete.role === 'super_admin') {
                return res.status(400).json({ success: false, message: 'Cannot delete another super admin.' });
            }
            await Admin.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Admin deleted successfully.' });
        } catch (error) {
            console.error('Delete admin error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }
            const { name, email, password, role } = req.body;
            if (role === 'super_admin') {
                const superAdminExists = await Admin.findOne({ role: 'super_admin' });
                if (superAdminExists) {
                    return res.status(403).json({
                        success: false,
                        message: 'Super admin already exists. Cannot register another.'
                    });
                }
                // Allow direct registration for the first super_admin
                const admin = new Admin({ name, email, password, role: 'super_admin' });
                await admin.save();
                const accessToken = admin.generateAccessToken();
                const refreshToken = admin.generateRefreshToken();
                admin.refreshToken = refreshToken;
                await admin.save();
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false, // Always false for localhost (HTTP)
                    sameSite: 'lax', // More permissive for local dev
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                return res.status(201).json({
                    success: true,
                    message: 'Super admin registered successfully',
                    admin,
                    accessToken
                });
            }
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(409).json({
                    success: false,
                    message: 'Admin with this email already exists'
                });
            }
            // For normal admin, require OTP approval
            const superAdmin = await Admin.findOne({ role: 'super_admin' });
            if (!superAdmin) {
                return res.status(500).json({ success: false, message: 'Super admin not found for OTP approval.' });
            }
            const otp = generateOTP();
            saveOTP(superAdmin.email, otp);
            global.pendingAdminRegs = global.pendingAdminRegs || {};
            global.pendingAdminRegs[email] = { name, email, password, role: role || 'admin' };
            await sendMail({
                to: superAdmin.email,
                subject: 'OTP for New Admin Registration',
                text: `OTP for approving new admin (${email}): ${otp}`,
                html: `<p>OTP for approving new admin (<b>${email}</b>): <b>${otp}</b></p>`
            });
            // Only return success, no admin object, to trigger OTP modal in frontend
            return res.status(200).json({ success: true, message: 'OTP sent to super admin for approval.' });
        } catch (error) {
            console.error('Registration error:', error);
            if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
                return res.status(503).json({
                    success: false,
                    message: 'Database connection timeout. Please try again later.',
                    error: 'Database temporarily unavailable'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async verifyAdminRegistration(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
            }
            const superAdmin = await Admin.findOne({ role: 'super_admin' });
            if (!superAdmin) {
                return res.status(500).json({ success: false, message: 'Super admin not found.' });
            }
            const valid = verifyOTP(superAdmin.email, otp);
            if (!valid) {
                return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
            }
            const regData = global.pendingAdminRegs && global.pendingAdminRegs[email];
            if (!regData) {
                return res.status(400).json({ success: false, message: 'No pending registration for this email.' });
            }
            const admin = new Admin(regData);
            await admin.save();
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();
            admin.refreshToken = refreshToken;
            await admin.save();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Always false for localhost (HTTP)
                sameSite: 'lax', // More permissive for local dev
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            delete global.pendingAdminRegs[email];
            return res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                data: {
                    admin,
                    accessToken
                }
            });
        } catch (error) {
            console.error('OTP verification error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required.' });
            }
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }
            if (!admin.isActive) {
                return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact super admin.' });
            }
            // Generate tokens
            const accessToken = admin.generateAccessToken();
            const refreshToken = admin.generateRefreshToken();
            admin.refreshToken = refreshToken;
            await admin.save();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Always false for localhost (HTTP)
                sameSite: 'lax', // More permissive for local dev
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    admin,
                    accessToken
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async refreshToken(req, res) {
        try {
            const oldRefreshToken = req.cookies.refreshToken;
            if (!oldRefreshToken) {
                return res.status(401).json({ success: false, message: 'No refresh token provided' });
            }

            // Find admin with this refresh token
            const admin = await Admin.findOne({ refreshToken: oldRefreshToken });
            if (!admin) {
                return res.status(403).json({ success: false, message: 'Invalid refresh token' });
            }

            // Verify old refresh token
            let payload;
            try {
                payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
            } catch (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
            }

            // Rotate refresh token: generate new, save, set cookie
            const newRefreshToken = admin.generateRefreshToken();
            admin.refreshToken = newRefreshToken;
            await admin.save();
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false, // Always false for localhost (HTTP)
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // Issue new access token
            const accessToken = admin.generateAccessToken();
            return res.status(200).json({ success: true, accessToken });
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async logout(req, res) {
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: true, message: 'Logged out' });
    }

    async clearAllTokens(req, res) {
        return res.status(501).json({ success: false, message: 'Not implemented' });
    }

    async getProfile(req, res) {
        try {
            // req.admin is set by verifyToken middleware
            if (!req.admin || !req.admin.id) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const admin = await Admin.findById(req.admin.id).select('-password -refreshToken');
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            return res.status(200).json({ success: true, data: admin });
        } catch (error) {
            console.error('Get profile error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateProfile(req, res) {
        return res.status(501).json({ success: false, message: 'Not implemented' });
    }

    async changePassword(req, res) {
        return res.status(501).json({ success: false, message: 'Not implemented' });
    }

    async getAllAdmins(req, res) {
        try {
            // Only super_admin can access (already checked by middleware)
            const admins = await Admin.find({}, '-password -refreshToken');
            return res.status(200).json({ success: true, data: admins });
        } catch (error) {
            console.error('Get all admins error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export default new AdminAuthController();
