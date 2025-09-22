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
router.get('/public', getAllHomeFAQs);

// Get FAQs with pagination (public)
router.get('/paginated', getHomeFAQsWithPagination);

// Search FAQs (public)
router.get('/search', searchHomeFAQs);

// Get single FAQ by ID (public)
router.get('/:id', getHomeFAQById);

// Create new FAQ (admin and super_admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), createHomeFAQ);

// Update FAQ (admin and super_admin)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), updateHomeFAQ);

// Delete FAQ (admin and super_admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteHomeFAQ);

export default router;
