import express from 'express';
import multer from 'multer';
import imageUpload from '../config/imageUpload.js';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import {
    createHomePage,
    getAllHomePages,
    getHomePageById,
    updateHomePage,
    deleteHomePage
} from '../controllers/homePageController.js';

const router = express.Router();

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size allowed is 5MB.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'Unexpected file field. Only "image" field is allowed.'
            });
        }
    }

    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    next(err);
};

// Create new homepage content (with file upload) - Admin only
router.post('/homepage', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), handleMulterError, createHomePage);

// Get all homepage content - Public
router.get('/homepage', getAllHomePages);

// Get homepage content by ID - Public
router.get('/homepage/:id', getHomePageById);

// Update homepage content (with file upload) - Admin only
router.put('/homepage/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), handleMulterError, updateHomePage);

// Delete homepage content - Admin only
router.delete('/homepage/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteHomePage);

export default router;