import express from 'express';
import multer from 'multer';
import careerInquiry, { getAllCareerApplications, testCaptcha } from '../../controllers/careerController.js';
import upload from '../../config/multer.js';
import verifyCaptcha from '../../middlewares/verifyCaptcha.js';

const router = express.Router();

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size allowed is 5MB.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'Unexpected file field. Only "resume" field is allowed.'
            });
        }
    }

    if (err.message && err.message.includes('Only PDF, DOC, and DOCX')) {
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }

    next(err);
};

// Career inquiry route with file upload (temporarily removing verifyCaptcha middleware)
router.post(
    '/career-inquiry',
    upload.single('resume'),
    handleMulterError,
    careerInquiry
);

// Test captcha endpoint
router.post('/test-captcha', testCaptcha);

// Get all career applications (admin route)
router.get('/applications', getAllCareerApplications);

export default router;