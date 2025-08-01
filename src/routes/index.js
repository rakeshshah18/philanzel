import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career.js';
import homePageRoutes from './home/homePageRoutes.js';
import newsRoutes from './newsRoutes.js';
import { routes as adminAuthRoutes } from '../adminAuth/index.js';
import ourTrackRoutes from './home/ourTrackRoutes.js';
import servicesRoutes from './servicesRoutes.js';
import tabbingServicesSettingsRoutes from './tabbingServicesSettingsRoutes.js';
import helpedIndustriesRoutes from './home/helpedIndustriesRoutes.js';
import whyChooseUsRoutes from './home/whyChooseUsRoutes.js';
import ourAssociationRoutes from './home/ourAssociationRoutes.js';
import homeFAQsRoutes from './home/homeFAQsRoutes.js';
import reviewSectionRoutes from './sections/reviewSectionRoutes.js';
import express from 'express';
const router = express.Router();

router.use('/user', newInquiryRoute);
router.use('/user', careerInquery);
router.use('/admin/services', servicesRoutes);
router.use('/admin/tabbing-services', tabbingServicesSettingsRoutes);
router.use('/admin/helped-industries', helpedIndustriesRoutes);
router.use('/admin/why-choose-us', whyChooseUsRoutes);
router.use('/admin/our-association', ourAssociationRoutes);
router.use('/admin/home-faqs', homeFAQsRoutes);
router.use('/admin/review-sections', reviewSectionRoutes);

// console.log('🚀 Routes registered:');
// console.log('  - /api/admin/services');
// console.log('  - /api/admin/tabbing-services');
// console.log('  - /api/admin/helped-industries');
// console.log('  - /api/admin/why-choose-us');
// console.log('  - /api/admin/our-association');
// console.log('  - /api/admin/home-faqs');
// console.log('  - /api/admin/review-sections');

router.use('/admin', homePageRoutes);
router.use('/admin', newsRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/our-track', ourTrackRoutes);

export default router;