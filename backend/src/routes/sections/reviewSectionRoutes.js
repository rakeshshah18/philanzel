import express from 'express';
import reviewSectionController from '../../controllers/sections/reviewSectionController.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Public routes
// Get active review sections (for public display)
router.get('/active', reviewSectionController.getActive);

// Get single review section by ID (public)
router.get('/:id', reviewSectionController.getById);

// Get all review sections (admin and super_admin)
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.getAll);

// Get all review sections for public
router.get('/', reviewSectionController.getAll);

// Create new review section (admin and super_admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.create);

// Update review section (admin and super_admin)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.update);

// Add review to existing section (admin and super_admin)
router.post('/:id/reviews', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.addReview);

// Recalculate all ratings (admin and super_admin)
router.post('/recalculate/ratings', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.recalculateRatings);

// Delete review section (admin and super_admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), reviewSectionController.delete);

export default router;
