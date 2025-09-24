import express from 'express';
import {
    upload,
    createWhyChoosePhilanzel,
    getAllWhyChoosePhilanzel,
    getWhyChoosePhilanzelById,
    updateWhyChoosePhilanzel,
    deleteWhyChoosePhilanzel
} from '../../controllers/partner/whyChoosePhilanzelController.js';

const router = express.Router();

// Create
router.post('/', upload.single('image'), createWhyChoosePhilanzel);
// Read all
router.get('/', getAllWhyChoosePhilanzel);
router.get('/public', getAllWhyChoosePhilanzel);
// Read one
router.get('/:id', getWhyChoosePhilanzelById);
// Update
router.put('/:id', upload.single('image'), updateWhyChoosePhilanzel);
// Delete
router.delete('/:id', deleteWhyChoosePhilanzel);

export default router;
