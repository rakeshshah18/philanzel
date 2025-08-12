import express from 'express';
import partnerInquiry, { getAllPartnerApplications, updateApplicationStatus, deletePartnerApplication } from '../controllers/partnerController.js';
import verifyCaptcha from '../middlewares/verifyCaptcha.js';

const router = express.Router();

// Partner inquiry route
router.post(
    '/partner-inquiry',
    verifyCaptcha,
    partnerInquiry
);

// Get all partner applications (admin route)
router.get('/partner-applications', getAllPartnerApplications);

// Update application status (admin route)
router.put('/partner-applications/:id/status', updateApplicationStatus);

// Delete partner application (admin route)
router.delete('/partner-applications/:id', deletePartnerApplication);

export default router;
