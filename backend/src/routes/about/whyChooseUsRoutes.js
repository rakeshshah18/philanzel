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
router.post('/why-choose-us',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    imageUpload.single('image'),
    createWhyChooseUs
);
router.get('/why-choose-us', getAllWhyChooseUs);
router.get('/why-choose-us/:id', getWhyChooseUsById);
router.put('/why-choose-us/:id',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    imageUpload.single('image'),
    updateWhyChooseUs
);
router.delete('/why-choose-us/:id',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    deleteWhyChooseUs
);
router.post('/why-choose-us/:id/points',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    validatePoint,
    addPointToWhyChooseUs
);
router.delete('/why-choose-us/:id/points/:pointId',
    verifyToken,
    requireRole(['admin', 'super_admin']),
    removePointFromWhyChooseUs
);

export default router;
