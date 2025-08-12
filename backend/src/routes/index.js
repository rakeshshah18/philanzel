import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career.js';
import careerPostRoutes from './careerPostRoutes.js';
import partnerInquiry from './partner.js';
import partnerPostRoutes from './partnerPostRoutes.js';
import homePageRoutes from './home/homePageRoutes.js';
import aboutUsRoutes from './about/aboutUsRoutes.js';
import ourJourneyRoutes from './about/ourJourneyRoutes.js';
import ourFounderRoutes from './about/ourFounderRoutes.js';
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

console.log('🔧 Routes index.js loading...');

// Add logging middleware to debug routes
router.use((req, res, next) => {
    console.log(`🌐 Request: ${req.method} ${req.path}`);
    next();
});

router.use('/user', newInquiryRoute);
router.use('/user', careerInquery);
router.use('/user', partnerInquiry);
router.use('/admin/career-posts', careerPostRoutes);
router.use('/career-posts', careerPostRoutes);

// Specific admin routes
router.use('/admin/tabbing-services', tabbingServicesSettingsRoutes);
router.use('/admin/helped-industries', helpedIndustriesRoutes);
router.use('/admin/why-choose-us', whyChooseUsRoutes);
router.use('/admin/our-association', ourAssociationRoutes);
router.use('/admin/home-faqs', homeFAQsRoutes);
router.use('/admin/review-sections', reviewSectionRoutes);
router.use('/admin/ads-sections', adsSectionRoutes);
router.use('/admin/footer', footerRoutes);
router.use('/footer', footerRoutes);

router.use('/admin/about/our-founder', ourFounderRoutes);
router.use('/about/our-founder', ourFounderRoutes);

router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/our-track', ourTrackRoutes);

// Partner routes MUST come before general /admin routes
router.use('/admin/partner-posts', partnerPostRoutes);
router.use('/partner-posts', partnerPostRoutes);

// General /admin routes MUST come LAST
router.use('/admin', homePageRoutes);
router.use('/admin', aboutUsRoutes);
router.use('/admin', ourJourneyRoutes);

export default router;
