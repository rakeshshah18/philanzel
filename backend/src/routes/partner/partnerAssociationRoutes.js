import express from 'express';
import { getAll, create, deleteImage } from '../../controllers/partner/partnerAssociationController.js';
import imageUpload from '../../config/imageUpload.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Get all images
router.get('/', getAll);

// Add new image (admin only)
router.post('/', verifyToken, requireRole('admin'), imageUpload.single('image'), create);

// Delete image (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), deleteImage);

export default router;
