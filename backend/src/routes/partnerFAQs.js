import express from 'express';
import {
  createPartnerFAQ,
  getAllPartnerFAQs,
  getPartnerFAQById,
  updatePartnerFAQ,
  deletePartnerFAQ
} from '../controllers/partner/partnerFAQsController.js';

const router = express.Router();

// Create FAQ
router.post('/', createPartnerFAQ);
// Get all FAQs
router.get('/', getAllPartnerFAQs);
// Get single FAQ
router.get('/:id', getPartnerFAQById);
// Update FAQ
router.put('/:id', updatePartnerFAQ);
// Delete FAQ
router.delete('/:id', deletePartnerFAQ);

export default router;
