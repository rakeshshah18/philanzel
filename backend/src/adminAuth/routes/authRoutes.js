import express from 'express';
const router = express.Router();

import adminAuthController from '../controllers/adminAuthController.js';
import { verifyToken, requireSuperAdmin } from '../middleware/authMiddleware.js';
import {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validatePasswordChange
} from '../validators/authValidators.js';

// Super admin can delete admin by ID
router.delete('/:id', verifyToken, requireSuperAdmin, adminAuthController.deleteAdmin);

// Public routes (no authentication required)
router.post('/register', validateRegister, adminAuthController.register);
router.post('/verify-admin-registration', adminAuthController.verifyAdminRegistration);
router.post('/login', validateLogin, adminAuthController.login);
router.post('/refresh-token', adminAuthController.refreshToken);
router.post('/clear-tokens', adminAuthController.clearAllTokens); // Emergency route to fix JWT issues

// Protected routes (require authentication)
router.post('/logout', verifyToken, adminAuthController.logout);
router.get('/profile', verifyToken, adminAuthController.getProfile);
router.put('/profile', verifyToken, validateProfileUpdate, adminAuthController.updateProfile);
router.put('/change-password', verifyToken, validatePasswordChange, adminAuthController.changePassword);

// Super admin only routes
router.get('/all', verifyToken, requireSuperAdmin, adminAuthController.getAllAdmins);

// Super admin: assign/retrieve allowedTabs for admin
router.put('/:id/assign-tabs', verifyToken, requireSuperAdmin, adminAuthController.assignTabs);
router.get('/:id/assigned-tabs', verifyToken, adminAuthController.getAssignedTabs);
// Super admin: get all assigned tabs for all admins
router.get('/all-assigned-tabs', verifyToken, requireSuperAdmin, adminAuthController.getAllAssignedTabs);

export default router;
