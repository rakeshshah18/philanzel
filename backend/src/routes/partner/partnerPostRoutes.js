import express from 'express';
import {
    getAllPartnerPosts,
    getPartnerPost,
    createPartnerPost,
    updatePartnerPost,
    deletePartnerPost
} from '../../controllers/partnerPostController.js';

console.log('🎯 partnerPostRoutes.js loaded successfully');

const router = express.Router();

// Routes - no file upload middleware needed for partner posts
router.get('/', getAllPartnerPosts);
router.get('/:id', getPartnerPost);
router.post('/', createPartnerPost);
router.put('/:id', updatePartnerPost);
router.delete('/:id', deletePartnerPost);

console.log('🎯 Partner routes configured:', router.stack.length, 'routes');

export default router;
