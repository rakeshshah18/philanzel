// ...existing code...
// ...existing code...
import sectionRoutes from './all services/sectionRoutes.js';
// import serviceRoutes from './all services/serviceRoutes.js';
import partnerAssociationImageRoutes from './partner/partnerAssociationImageRoutes.js';
import contactUsRoutes from './contactUs/contactUsRoutes.js';
import whyChoosePhilanzelRoutes from './partner/whyChoosePhilanzel.js';
import partnerFAQsRoutes from './partnerFAQs.js';
import newInquiryRoute from './inquiryRoutes.js';
import careerInquery from './career/career.js';
import careerPostRoutes from './career/careerPostRoutes.js';
import partnerInquiry from './partner/partner.js';
import partnerPostRoutes from './partner/partnerPostRoutes.js';
import ourProcessRoutes from './partner/ourProcess.js';
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
import footerRoutes from './sections/footerRoutes.js';
import empoweringIndividual from './partner/empoweringIndividualRoutes.js';
import potentialGrowthRoutes from './partner/potentialGrowthRoutes.js';
import express from 'express';
import uploadRoutes from './partner/upload.js';
import aboutServiceRoutes from './all services/aboutServiceRoutes.js';
import calculatorPagesRoutes from './calculators/pagesRoutes.js';
import calculatorSectionRoutes from './calculators/sectionRoutes.js';

const router = express.Router();

// Public review sections routes (after router is initialized)
router.use('/review-sections', reviewSectionRoutes);
// Public ads sections routes (after router is initialized)
router.use('/ads-sections', adsSectionRoutes);

// Dynamic services API
// Only use one /services route registration to avoid conflicts
router.use('/services', servicesRoutes);

// Debug logging middleware removed for production

router.use('/user', newInquiryRoute);
router.use('/user', careerInquery);
router.use('/user', partnerInquiry);
router.use('/admin/career-posts', careerPostRoutes);
router.use('/career-posts', careerPostRoutes);

// Specific admin routes
router.use('/admin/tabbing-services', tabbingServicesSettingsRoutes);
router.use('/admin/services', servicesRoutes);
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
router.use('/admin/partner-faqs', partnerFAQsRoutes);
router.use('/partner-faqs', partnerFAQsRoutes);
router.use('/partner', partnerAssociationImageRoutes);
//partner our process routes
router.use('/partner/our-process', ourProcessRoutes);
// Empowering Individuals routes
router.use('/partner/empowering-individuals', empoweringIndividual);
// Potential Growth routes
router.use('/partner/potential-growth', potentialGrowthRoutes);

// Register the new /api/upload route for image uploads
router.use('/upload', uploadRoutes);

// Why Choose Philanzel routes
router.use('/partner/why-choose-philanzel', whyChoosePhilanzelRoutes);

// Contact Us form submissions route
router.use('/contact-us', contactUsRoutes);

// Register calculators pages API
router.use('/calculators/pages', calculatorPagesRoutes);
router.use('/calculators/sections', calculatorSectionRoutes);

// General /admin routes MUST come LAST
// Public homepage routes (GET /homepage, GET /homepage/:id)
router.use(homePageRoutes);
// Admin homepage routes
router.use('/admin', homePageRoutes);

// Public about us routes (GET /about-us, GET /about-us/:id)
router.use(aboutUsRoutes);

// Public our journey routes (GET /our-journey, GET /our-journey/:id)
router.use(ourJourneyRoutes);
router.use('/admin', aboutUsRoutes);
router.use('/admin', ourJourneyRoutes);
router.use('/admin/services-sections/about-service', aboutServiceRoutes);
// Flexible section API for all services
router.use('/sections', sectionRoutes);

export default router;
