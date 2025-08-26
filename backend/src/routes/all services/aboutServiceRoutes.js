import express from 'express';
import aboutServiceController from '../../controllers/all services/aboutServiceController.js';
import { verifyToken, requireAdmin } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Create a new aboutService section (public for testing)
router.post('/', aboutServiceController.createAboutService);

// Get all aboutService sections (public for testing)
router.get('/', aboutServiceController.getAllAboutServices);

// Get a single aboutService section by ID (public for testing)
router.get('/:id', aboutServiceController.getAboutServiceById);

// Update an aboutService section
router.put('/:id', verifyToken, requireAdmin, aboutServiceController.updateAboutService);

// Delete an aboutService section
router.delete('/:id', verifyToken, requireAdmin, aboutServiceController.deleteAboutService);

export default router;
