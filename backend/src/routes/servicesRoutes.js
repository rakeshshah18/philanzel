import express from 'express';
import multer from 'multer';
import imageUpload from '../config/imageUpload.js';
import { verifyToken, requireRole } from '../adminAuth/middleware/authMiddleware.js';
import { createServices, getAllServices, updateServices, deleteServices, updateServiceSection, deleteServiceSection } from '../controllers/servicesController.js';

const router = express.Router();

// Edit a section in a service
router.put('/:serviceId/sections/:sectionIndex', verifyToken, requireRole('admin'), updateServiceSection);
router.delete('/:serviceId/sections/:sectionIndex', verifyToken, requireRole('admin'), deleteServiceSection);

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Too many files uploaded.'
            });
        }
    }

    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({
            success: false,
            message: 'Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!'
        });
    }

    next(err);
};

router.post('/', verifyToken, requireRole('admin'), imageUpload.single('image'), handleMulterError, createServices);
router.get('/', verifyToken, requireRole('admin'), getAllServices);
router.put('/:id', verifyToken, requireRole('admin'), imageUpload.single('image'), handleMulterError, updateServices);
router.delete('/:id', verifyToken, requireRole('admin'), deleteServices);

// Add AboutService section to a service
import { addSectionToService, addSectionToServiceById } from '../controllers/servicesController.js';
router.post('/:serviceId/sections', verifyToken, requireRole('admin'), addSectionToServiceById);
router.post('/:serviceName/add-section', verifyToken, requireRole('admin'), addSectionToService);

export default router;
