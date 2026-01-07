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
router.post('/our-journey', verifyToken, requireRole(['admin', 'super_admin']), createOurJourney);
router.get('/our-journey', getAllOurJourney);
router.get('/our-journey/:id', getOurJourneyById);
router.put('/our-journey/:id', verifyToken, requireRole(['admin', 'super_admin']), updateOurJourney);
router.delete('/our-journey/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteOurJourney);
router.post('/our-journey/:id/cards', verifyToken, requireRole(['admin', 'super_admin']), addCardToOurJourney);
router.delete('/our-journey/:id/cards/:cardIndex', verifyToken, requireRole(['admin', 'super_admin']), removeCardFromOurJourney);

export default router;
