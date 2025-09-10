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
// Get all ads sections (admin and super_admin)
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), getAllAdsSections);

// Get ads sections with pagination (admin and super_admin)
router.get('/paginated', verifyToken, requireRole(['admin', 'super_admin']), getAdsSectionsWithPagination);

// Search ads sections (admin and super_admin)
router.get('/search', verifyToken, requireRole(['admin', 'super_admin']), searchAdsSections);

// Create a new ads section (admin and super_admin) - with optional image upload
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), createAdsSection);

// Get a specific ads section by ID (admin and super_admin)
router.get('/:id', verifyToken, requireRole(['admin', 'super_admin']), getAdsSectionById);

// Update an ads section (admin and super_admin) - with optional image upload
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), updateAdsSection);

// Update an ads section (admin and super_admin)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), updateAdsSection);

// Delete an ads section (admin and super_admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteAdsSection);

export default router;