import express from 'express';
import {
    getAllPartnerPosts,
    getPartnerPost,
    createPartnerPost,
    updatePartnerPost,
    deletePartnerPost
} from '../../controllers/partner/partnerPostController.js';


const router = express.Router();

// Routes - no file upload middleware needed for partner posts
router.get('/', getAllPartnerPosts);
router.get('/:id', getPartnerPost);
router.post('/', createPartnerPost);
router.put('/:id', updatePartnerPost);
router.delete('/:id', deletePartnerPost);


export default router;
