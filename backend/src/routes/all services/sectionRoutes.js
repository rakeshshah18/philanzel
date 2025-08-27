import express from 'express';
import {
    createSection,
    getAllSections,
    getSectionById,
    updateSection,
    deleteSection
} from '../../controllers/all services/sectionController.js';

const router = express.Router();

// Create a new section
router.post('/', createSection);

// Get all sections
router.get('/', getAllSections);

// Get a single section by ID
router.get('/:id', getSectionById);

// Update a section
router.put('/:id', updateSection);

// Delete a section
router.delete('/:id', deleteSection);

export default router;
