import express from 'express';
import {
    createEmpoweringIndividual,
    getAllEmpoweringIndividuals,
    uploadEmpoweringImages
} from '../../controllers/partner/empoweringIndividualController.js';

const router = express.Router();
router.post('/', uploadEmpoweringImages, createEmpoweringIndividual);
router.get('/', getAllEmpoweringIndividuals);
router.get('/public', getAllEmpoweringIndividuals);
import { updateEmpoweringIndividual, deleteEmpoweringIndividual } from '../../controllers/partner/empoweringIndividualController.js';
router.put('/:id', uploadEmpoweringImages, updateEmpoweringIndividual);
router.delete('/:id', deleteEmpoweringIndividual);

export default router;
