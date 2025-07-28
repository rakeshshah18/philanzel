import express from 'express';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import { postOurTrack, getOurTrack, updateOurTrack, deleteOurTrack } from '../controllers/ourTrackController.js';

const router = express.Router();

// Public route - anyone can view the track record
router.get('/', getOurTrack);

// Protected routes - only admins can modify
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), postOurTrack);
router.put('/', verifyToken, requireRole(['admin', 'super_admin']), updateOurTrack);
router.delete('/', verifyToken, requireRole(['admin', 'super_admin']), deleteOurTrack);

export default router;