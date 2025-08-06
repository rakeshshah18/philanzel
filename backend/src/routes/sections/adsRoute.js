import express from 'express';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../../config/imageUpload.js';
import {
    createAdsSection,
    getAllAdsSections,
    getAdsSectionById,
    updateAdsSection,
    deleteAdsSection,
    getAdsSectionsWithPagination,
    searchAdsSections
} from '../../controllers/sections/adsSectionController.js';

const router = express.Router();

// Admin routes (protected)
// Get all ads sections (admin only)
router.get('/', verifyToken, requireRole('admin'), getAllAdsSections);

// Get ads sections with pagination (admin only)
router.get('/paginated', verifyToken, requireRole('admin'), getAdsSectionsWithPagination);

// Search ads sections (admin only)
router.get('/search', verifyToken, requireRole('admin'), searchAdsSections);

// Create a new ads section (admin only) - with optional image upload
router.post('/', verifyToken, requireRole('admin'), imageUpload.single('image'), createAdsSection);

// Get a specific ads section by ID (admin only)
router.get('/:id', verifyToken, requireRole('admin'), getAdsSectionById);

// Update an ads section (admin only) - with optional image upload
router.put('/:id', verifyToken, requireRole('admin'), imageUpload.single('image'), updateAdsSection);

// Update an ads section (admin only)
router.put('/:id', verifyToken, requireRole('admin'), updateAdsSection);

// Delete an ads section (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), deleteAdsSection);

export default router;