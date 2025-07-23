import newInquiryRoute from './inquiryRoutes.js';
import express from 'express';
const router = express.Router();

router.use('/user', newInquiryRoute);

export default router;