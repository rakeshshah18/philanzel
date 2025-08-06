import express from 'express';
import reviewSectionController from '../../controllers/sections/reviewSectionController.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Public routes
// Get active review sections (for public display)
router.get('/active', reviewSectionController.getActive);

// Get single review section by ID (public)
router.get('/:id', reviewSectionController.getById);

// Admin routes (protected)
// Get all review sections (admin only)
router.get('/', verifyToken, requireRole('admin'), reviewSectionController.getAll);

// Create new review section (admin only)
router.post('/', verifyToken, requireRole('admin'), reviewSectionController.create);

// Update review section (admin only)
router.put('/:id', verifyToken, requireRole('admin'), reviewSectionController.update);

// Add review to existing section (admin only)
router.post('/:id/reviews', verifyToken, requireRole('admin'), reviewSectionController.addReview);

// Recalculate all ratings (admin only)
router.post('/recalculate/ratings', verifyToken, requireRole('admin'), reviewSectionController.recalculateRatings);

// Delete review section (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), reviewSectionController.delete);

export default router;
