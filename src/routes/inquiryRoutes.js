import express from 'express';
import createNewUserInquiry from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/inquiries', createNewUserInquiry);

export default router;