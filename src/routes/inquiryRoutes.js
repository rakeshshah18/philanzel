import express from 'express';
import createNewUserInquiry from '../controllers/inquiryController.js';
import verifyCaptcha from '../middlewares/verifyCaptcha.js';

const router = express.Router();

// Create inquiry with reCAPTCHA verification
router.post('/inquiries', verifyCaptcha, createNewUserInquiry);

export default router;