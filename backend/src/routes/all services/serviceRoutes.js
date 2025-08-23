import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from '../../controllers/all services/serviceController.js';

const router = express.Router();

// Create a new service
router.post('/', createService);
// Get all services
router.get('/', getAllServices);
// Get a single service by ID
router.get('/:id', getServiceById);
// Update a service
router.put('/:id', updateService);
// Delete a service
router.delete('/:id', deleteService);

export default router;
