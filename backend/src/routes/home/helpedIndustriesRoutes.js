import express from 'express';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import helpedIndustriesController from '../../controllers/home/helpedIndustriesController.js';

const router = express.Router();


// Get all helped industries
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), helpedIndustriesController.getAll);
router.get('/public', helpedIndustriesController.getAll);

// Get single helped industries by ID
router.get('/:id', verifyToken, requireRole(['admin', 'super_admin']), helpedIndustriesController.getById);

// Create new helped industries
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), helpedIndustriesController.create);

// Update helped industries
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), helpedIndustriesController.update);


// Delete helped industries
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), helpedIndustriesController.delete);

// Public: Get all helped industries (no auth) - keep this last
router.get('/public', helpedIndustriesController.getAll);

export default router;
