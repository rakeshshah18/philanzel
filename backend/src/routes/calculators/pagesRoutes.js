import express from 'express';
const router = express.Router();
import {
    getAllPages,
    getPageById,
    createPage,
    updatePage,
    deletePage,
    getBySlug,
    addSectionToPage,
    editSectionInPage,
    deleteSectionFromPage
} from '../../controllers/calculators/pageController.js';

// Add a section to a calculator page by id
router.post('/:id/add-section', addSectionToPage);

// Edit a section in a calculator page's embedded sections array
router.put('/:id/sections/:sectionId', editSectionInPage);

// Delete a section from a calculator page's embedded sections array
router.delete('/:id/sections/:sectionId', deleteSectionFromPage);

// Get a calculator page by slug
router.get('/slug/:slug', getBySlug);

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
