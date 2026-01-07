import express from 'express';
import {
    createSection,
    getAllSections,
    getSectionById,
    updateSection,
    deleteSection
} from '../../controllers/all services/sectionController.js';

const router = express.Router();
router.post('/', createSection);
router.get('/', getAllSections);
router.get('/:id', getSectionById);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

export default router;
