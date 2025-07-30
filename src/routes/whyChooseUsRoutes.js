import express from 'express';
import whyChooseUsController from '../controllers/whyChooseUsController.js';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../config/imageUpload.js';

const router = express.Router();

// Get all why choose us entries (public)
router.get('/', whyChooseUsController.getAll);

// Get single why choose us entry by ID (public)
router.get('/:id', whyChooseUsController.getById);

// Create new why choose us entry (admin only)
router.post('/', verifyToken, requireRole('admin'), imageUpload.single('image'), whyChooseUsController.create);

// Update why choose us entry (admin only)
router.put('/:id', verifyToken, requireRole('admin'), imageUpload.single('image'), whyChooseUsController.update);

// Delete why choose us entry (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), whyChooseUsController.delete);

export default router;
