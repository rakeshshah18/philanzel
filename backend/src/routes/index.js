import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career.js';
import homePageRoutes from './home/homePageRoutes.js';
import aboutUsRoutes from './about/aboutUsRoutes.js';
import ourJourneyRoutes from './about/ourJourneyRoutes.js';
import ourFounderRoutes from './about/ourFounderRoutes.js';
// import aboutWhyChooseUsRoutes from './about/whyChooseUsRoutes.js'; // Temporarily disabled
import { routes as adminAuthRoutes } from '../adminAuth/index.js';
import ourTrackRoutes from './home/ourTrackRoutes.js';
import servicesRoutes from './servicesRoutes.js';
import tabbingServicesSettingsRoutes from './tabbingServicesSettingsRoutes.js';
import helpedIndustriesRoutes from './home/helpedIndustriesRoutes.js';
import whyChooseUsRoutes from './home/whyChooseUsRoutes.js';
import ourAssociationRoutes from './home/ourAssociationRoutes.js';
import homeFAQsRoutes from './home/homeFAQsRoutes.js';
import reviewSectionRoutes from './sections/reviewSectionRoutes.js';
import adsSectionRoutes from './sections/adsRoute.js';
import footerRoutes from './footerRoutes.js';
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
router.use('/admin/ads-sections', adsSectionRoutes);
router.use('/admin/footer', footerRoutes);
router.use('/footer', footerRoutes); // Public footer endpoint

// console.log('🚀 Routes registered:');
// console.log('  - /api/admin/services');
// console.log('  - /api/admin/tabbing-services');
// console.log('  - /api/admin/helped-industries');
// console.log('  - /api/admin/why-choose-us');
// console.log('  - /api/admin/our-association');
// console.log('  - /api/admin/home-faqs');
// console.log('  - /api/admin/review-sections');
// console.log('  - /api/admin/ads-sections');

router.use('/admin', homePageRoutes);
router.use('/admin', aboutUsRoutes);
router.use('/admin', ourJourneyRoutes);

// Debug logging for our founder routes
console.log('🔍 Registering Our Founder routes...');
console.log('✅ ourFounderRoutes imported:', typeof ourFounderRoutes);

router.use('/admin/about/our-founder', ourFounderRoutes);
router.use('/about/our-founder', ourFounderRoutes); // Public route for our founder

console.log('🚀 Our Founder routes registered:');
console.log('  - /api/admin/about/our-founder');
console.log('  - /api/about/our-founder');
// router.use('/admin/about', aboutWhyChooseUsRoutes); // Temporarily disabled due to import conflicts
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/our-track', ourTrackRoutes);

export default router;