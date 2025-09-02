import express from 'express';
import {
    getAllPages,
    getPageById,
    createPage,
    updatePage,
    deletePage
} from '../../controllers/calculators/pageController.js';

const router = express.Router();

// Get all calculator pages
router.get('/', getAllPages);

// Get a single page by ID
router.get('/:id', getPageById);

// Create a new calculator page
router.post('/', createPage);

// Update a calculator page
router.put('/:id', updatePage);

// Delete a calculator page
router.delete('/:id', deletePage);

export default router;
