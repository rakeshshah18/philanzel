import express from 'express';
import { verifyToken, requireRole } from '../../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../../config/imageUpload.js';
import { validateWhyChooseUs, validatePoint } from '../../validators/about/whyChooseUsValidators.js';
import {
    createWhyChooseUs,
    getAllWhyChooseUs,
    getWhyChooseUsById,
    updateWhyChooseUs,
    deleteWhyChooseUs,
    addPointToWhyChooseUs,
    removePointFromWhyChooseUs
} from '../../controllers/about/whyChooseUsController.js';

const router = express.Router();

// Create new why choose us content - Admin only
router.post('/why-choose-us',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    imageUpload.single('image'),
    createWhyChooseUs
);

// Get all why choose us content - Public/Admin
router.get('/why-choose-us', getAllWhyChooseUs);

// Get why choose us content by ID - Public/Admin
router.get('/why-choose-us/:id', getWhyChooseUsById);

// Update why choose us content - Admin only
router.put('/why-choose-us/:id',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    imageUpload.single('image'),
    updateWhyChooseUs
);

// Delete why choose us content - Admin only
router.delete('/why-choose-us/:id',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    deleteWhyChooseUs
);

// Add a new point to existing why choose us content - Admin only
router.post('/why-choose-us/:id/points',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    validatePoint,
    addPointToWhyChooseUs
);

// Remove a point from why choose us content - Admin only
router.delete('/why-choose-us/:id/points/:pointId',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    removePointFromWhyChooseUs
);

export default router;
