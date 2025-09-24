import express from 'express';
import {
    getAllSidebarItems,
    getSidebarItemById,
    createSidebarItem,
    updateSidebarItem,
    deleteSidebarItem,
    reorderSidebarItems
} from '../controllers/sidebarController.js';

const router = express.Router();

// GET /api/sidebar - Get all sidebar items
router.get('/', getAllSidebarItems);

// GET /api/sidebar/:id - Get sidebar item by ID
router.get('/:id', getSidebarItemById);

// POST /api/sidebar - Create new sidebar item
router.post('/', createSidebarItem);

// PUT /api/sidebar/:id - Update sidebar item
router.put('/:id', updateSidebarItem);

// DELETE /api/sidebar/:id - Delete sidebar item
router.delete('/:id', deleteSidebarItem);

// PUT /api/sidebar/reorder - Reorder sidebar items
router.put('/reorder', reorderSidebarItems);

export default router;