import express from 'express';
import ourAssociationController from '../../controllers/home/ourAssociationController.js';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../../config/imageUpload.js';

const router = express.Router();

// Create custom multer instance that accepts any field name
const customImageUpload = imageUpload.any();

// Get all our association entries (public)
router.get('/', ourAssociationController.getAll);

// Get single our association entry by ID (public)
router.get('/:id', ourAssociationController.getById);

// Create new our association entry (admin only)
router.post('/', verifyToken, requireRole('admin'), customImageUpload, ourAssociationController.create);

// Update our association entry (admin only)
router.put('/:id', verifyToken, requireRole('admin'), customImageUpload, ourAssociationController.update);

// Delete our association entry (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), ourAssociationController.delete);

export default router;
