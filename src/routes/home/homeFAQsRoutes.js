import express from 'express';
import {
    createHomeFAQ,
    getAllHomeFAQs,
    getHomeFAQById,
    updateHomeFAQ,
    deleteHomeFAQ,
    searchHomeFAQs,
    getHomeFAQsWithPagination
} from '../../controllers/home/homeFAQSController.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Get all FAQs (public)
router.get('/', getAllHomeFAQs);

// Get FAQs with pagination (public)
router.get('/paginated', getHomeFAQsWithPagination);

// Search FAQs (public)
router.get('/search', searchHomeFAQs);

// Get single FAQ by ID (public)
router.get('/:id', getHomeFAQById);

// Create new FAQ (admin only)
router.post('/', verifyToken, requireRole('admin'), createHomeFAQ);

// Update FAQ (admin only)
router.put('/:id', verifyToken, requireRole('admin'), updateHomeFAQ);

// Delete FAQ (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), deleteHomeFAQ);

export default router;
