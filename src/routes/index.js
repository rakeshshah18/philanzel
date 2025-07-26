import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career.js';
import homePageRoutes from './homePageRoutes.js';
import newsRoutes from './newsRoutes.js';
import { routes as adminAuthRoutes } from '../adminAuth/index.js';
import express from 'express';
const router = express.Router();

router.use('/user', newInquiryRoute);
router.use('/user', careerInquery);
router.use('/admin', homePageRoutes);
router.use('/admin', newsRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/auth', adminAuthRoutes);

export default router;