import express from 'express';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import {
    createOurJourney,
    getAllOurJourney,
    getOurJourneyById,
    updateOurJourney,
    deleteOurJourney,
    addCardToOurJourney,
    removeCardFromOurJourney
} from '../../controllers/about/ourJourneyController.js';

const router = express.Router();

// Create new our journey content - Admin only
router.post('/our-journey', verifyToken, requireRole(['admin', 'super_admin']), createOurJourney);

// Get all our journey content - Public/Admin
router.get('/our-journey', getAllOurJourney);

// Get our journey content by ID - Public/Admin
router.get('/our-journey/:id', getOurJourneyById);

// Update our journey content - Admin only
router.put('/our-journey/:id', verifyToken, requireRole(['admin', 'super_admin']), updateOurJourney);

// Delete our journey content - Admin only
router.delete('/our-journey/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteOurJourney);

// Add a new card to existing our journey content - Admin only
router.post('/our-journey/:id/cards', verifyToken, requireRole(['admin', 'super_admin']), addCardToOurJourney);

// Remove a card from our journey content - Admin only
router.delete('/our-journey/:id/cards/:cardIndex', verifyToken, requireRole(['admin', 'super_admin']), removeCardFromOurJourney);

export default router;
