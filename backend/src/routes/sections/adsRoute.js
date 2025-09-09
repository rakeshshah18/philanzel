
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
    searchAdsSections,
    getActiveAdsSections
} from '../../controllers/sections/adsSectionController.js';

const router = express.Router();

// Public route: Get all visible ads sections
router.get('/active', getActiveAdsSections);


// Admin routes (protected, allow both admin and super_admin)
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), getAllAdsSections);
router.get('/paginated', verifyToken, requireRole(['admin', 'super_admin']), getAdsSectionsWithPagination);
router.get('/search', verifyToken, requireRole(['admin', 'super_admin']), searchAdsSections);
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), createAdsSection);
router.get('/:id', verifyToken, requireRole(['admin', 'super_admin']), getAdsSectionById);
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), updateAdsSection);
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), updateAdsSection);
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteAdsSection);

export default router;