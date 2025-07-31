import express from 'express';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import helpedIndustriesController from '../../controllers/home/helpedIndustriesController.js';

const router = express.Router();

// Get all helped industries
router.get('/', verifyToken, requireRole('admin'), helpedIndustriesController.getAll);

// Get single helped industries by ID
router.get('/:id', verifyToken, requireRole('admin'), helpedIndustriesController.getById);

// Create new helped industries
router.post('/', verifyToken, requireRole('admin'), helpedIndustriesController.create);

// Update helped industries
router.put('/:id', verifyToken, requireRole('admin'), helpedIndustriesController.update);

// Delete helped industries
router.delete('/:id', verifyToken, requireRole('admin'), helpedIndustriesController.delete);

export default router;
