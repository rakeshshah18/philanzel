import express from 'express';
import {
    createPotentialGrowth,
    getAllPotentialGrowth,
    getPotentialGrowthById,
    updatePotentialGrowth,
    deletePotentialGrowth
} from '../../controllers/partner/potentialGrowthController.js';

const router = express.Router();

// Create
router.post('/', createPotentialGrowth);

// Read all
router.get('/', getAllPotentialGrowth);
router.get('/public', getAllPotentialGrowth);

// Read by ID
router.get('/:id', getPotentialGrowthById);

// Update by ID
router.put('/:id', updatePotentialGrowth);

// Delete by ID
router.delete('/:id', deletePotentialGrowth);

export default router;
