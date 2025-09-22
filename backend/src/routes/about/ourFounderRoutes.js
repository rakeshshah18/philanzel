import express from 'express';
import ourFounderController from '../../controllers/about/ourFounderController.js';
import { verifyToken, requireAdmin } from '../../adminAuth/middleware/authMiddleware.js';
import imageUpload from '../../config/imageUpload.js';
import {
    createOurFounderValidation,
    updateOurFounderValidation,
    getOurFounderByIdValidation,
    deleteOurFounderValidation
} from '../../validators/about/ourFounderValidators.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        });
    }
    next();
};

// Public routes - for frontend display
router.get('/', ourFounderController.getAll);
// router.get('/our-founder', ourFounderController.getAll);
router.get('/:id', getOurFounderByIdValidation, handleValidation, ourFounderController.getById);

// Protected routes - admin only
router.post('/',
    verifyToken,
    requireAdmin,
    imageUpload.single('image'),
    createOurFounderValidation,
    handleValidation,
    ourFounderController.create
);

router.put('/:id',
    verifyToken,
    requireAdmin,
    imageUpload.single('image'),
    updateOurFounderValidation,
    handleValidation,
    ourFounderController.update
);

router.delete('/:id',
    verifyToken,
    requireAdmin,
    deleteOurFounderValidation,
    handleValidation,
    ourFounderController.delete
);

export default router;
