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

// Create a new service
router.post('/', createService);
// Get all services
router.get('/', getAllServices);
// Get a single service by ID
router.get('/:id', getServiceById);
// Get a single service by slug
router.get('/slug/:slug', getServiceBySlug);
// Update a service
router.put('/:id', updateService);
// Delete a service
router.delete('/:id', deleteService);

// Add AboutService section to a service
router.post('/:serviceName/add-section', addSectionToService);

export default router;
