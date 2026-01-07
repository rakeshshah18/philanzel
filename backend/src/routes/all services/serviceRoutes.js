import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    getServiceBySlug,
    updateService,
    deleteService,
    addSectionToService
} from '../../controllers/all services/serviceController.js';

const router = express.Router();
router.post('/', createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.get('/slug/:slug', getServiceBySlug);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.post('/:serviceName/add-section', addSectionToService);

export default router;
