import express from 'express';
import { getAll, create, deleteImage } from '../../controllers/partner/partnerAssociationController.js';
import imageUpload from '../../config/imageUpload.js';

const router = express.Router();

// Get all images
router.get('/', getAll);

// Add new image
router.post('/', imageUpload.single('image'), create);

// Delete image
router.delete('/:id', deleteImage);

export default router;
