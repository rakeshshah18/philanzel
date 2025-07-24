import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career.js';
import express from 'express';
const router = express.Router();

router.use('/user', newInquiryRoute);
router.use('/user', careerInquery);

export default router;