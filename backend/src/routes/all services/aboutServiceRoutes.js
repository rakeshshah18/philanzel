import express from 'express';
import aboutServiceController from '../../controllers/all services/aboutServiceController.js';
import { verifyToken, requireAdmin } from '../../adminAuth/middleware/authMiddleware.js';

const router = express.Router();
router.post('/', aboutServiceController.createAboutService);
router.get('/', aboutServiceController.getAllAboutServices);
router.get('/:id', aboutServiceController.getAboutServiceById);
router.put('/:id', verifyToken, requireAdmin, aboutServiceController.updateAboutService);
router.delete('/:id', verifyToken, requireAdmin, aboutServiceController.deleteAboutService);

export default router;
