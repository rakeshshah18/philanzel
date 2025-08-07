import express from 'express';
import whyChooseUsRoutes from './whyChooseUsRoutes.js';

const router = express.Router();

// About page routes
router.use('/why-choose-us', whyChooseUsRoutes);

export default router;
