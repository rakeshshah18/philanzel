import express from 'express';
import multer from 'multer';
import imageUpload from '../config/imageUpload.js';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    getCategories
} from '../controllers/newsController.js';

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
                message: 'Unexpected file field. Only "thumbnail" field is allowed.'
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

// Create new news article (with file upload) - Admin only
router.post('/news', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('thumbnail'), handleMulterError, createNews);

// Get all news articles - Public
router.get('/news', getAllNews);

// Get news categories - Public
router.get('/news/categories', getCategories);

// Get news article by ID - Public
router.get('/news/:id', getNewsById);

// Update news article (with file upload) - Admin only
router.put('/news/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('thumbnail'), handleMulterError, updateNews);

// Delete news article - Admin only
router.delete('/news/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteNews);

export default router;
