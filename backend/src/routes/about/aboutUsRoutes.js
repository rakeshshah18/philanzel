import express from 'express';
import multer from 'multer';
import imageUpload from '../../config/imageUpload.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import {
    createAboutUs,
    getAllAboutUs,
    getAboutUsById,
    updateAboutUs,
    deleteAboutUs
} from '../../controllers/about/aboutUsController.js';

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

// Create new about us content (with file upload) - Admin only
router.post('/about-us', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), handleMulterError, createAboutUs);

// Get all about us content - Public/Admin
router.get('/about-us', getAllAboutUs);

// Get about us content by ID - Public/Admin
router.get('/about-us/:id', getAboutUsById);

// Update about us content (with file upload) - Admin only
router.put('/about-us/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), handleMulterError, updateAboutUs);

// Delete about us content - Admin only
router.delete('/about-us/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteAboutUs);

export default router;
