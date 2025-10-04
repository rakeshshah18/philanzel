import express from 'express';
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updateProfile
} from '../../controllers/users/userController.js';
import { protect } from '../../middlewares/user.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;