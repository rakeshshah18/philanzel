import express from 'express';
import {
    getAllStrategies,
    getPaginatedStrategies,
    searchStrategies,
    getStrategyById,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    activateStrategy,
    deactivateStrategy,
    getActiveStrategy
} from '../controllers/optimizeStrategyController.js';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';

const router = express.Router();

// Public route for getting active strategy (no auth required)
router.get('/active', getActiveStrategy);

// Apply authentication middleware to all other routes
router.use(verifyToken);
router.use(requireRole(['super_admin', 'admin']));

// Get all strategies
router.get('/', getAllStrategies);

// Get paginated strategies
router.get('/paginated', getPaginatedStrategies);

// Search strategies
router.get('/search', searchStrategies);

// Activate strategy
router.patch('/:id/activate', activateStrategy);

// Deactivate strategy
router.patch('/:id/deactivate', deactivateStrategy);

// Get single strategy by ID
router.get('/:id', getStrategyById);

// Create new strategy
router.post('/', createStrategy);

// Update strategy
router.put('/:id', updateStrategy);

// Delete strategy
router.delete('/:id', deleteStrategy);

export default router;
