import express from 'express';
import whyChooseUsController from '../../controllers/home/whyChooseUsController.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../../config/imageUpload.js';

const router = express.Router();

// Get all why choose us entries (public)
router.get('/', whyChooseUsController.getAll);

// Get single why choose us entry by ID (public)
router.get('/:id', whyChooseUsController.getById);

// Create new why choose us entry (admin and super_admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), whyChooseUsController.create);

// Update why choose us entry (admin and super_admin)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), whyChooseUsController.update);

// Delete why choose us entry (admin and super_admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), whyChooseUsController.delete);

export default router;
