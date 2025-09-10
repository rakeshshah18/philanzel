import express from 'express';
import { getAll, create, deleteImage } from '../../controllers/partner/partnerAssociationController.js';
import imageUpload from '../../config/imageUpload.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Get all images
router.get('/', getAll);

// Add new image (admin and super_admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), imageUpload.single('image'), create);

// Delete image (admin and super_admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), deleteImage);

export default router;
