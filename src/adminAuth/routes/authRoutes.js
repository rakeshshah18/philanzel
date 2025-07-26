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

// Public routes
router.post('/register', validateRegister, adminAuthController.register);
router.post('/login', validateLogin, adminAuthController.login);
router.post('/refresh-token', adminAuthController.refreshToken);

// Protected routes (require authentication)
router.use(verifyToken); // All routes below require authentication

router.post('/logout', adminAuthController.logout);
router.get('/profile', adminAuthController.getProfile);
router.put('/profile', validateProfileUpdate, adminAuthController.updateProfile);
router.put('/change-password', validatePasswordChange, adminAuthController.changePassword);

// Super admin only routes
router.get('/all', requireSuperAdmin, adminAuthController.getAllAdmins);

export default router;
