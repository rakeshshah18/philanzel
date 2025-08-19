import express from 'express';
import {
    getAllContactForms,
    createContactForm,
    createContactInfo,
    getAllContactInfo,
    getContactInfoById,
    updateContactInfo,
    deleteContactInfo
} from '../../controllers/contactUs/contactUsController.js';

const router = express.Router();

// GET /api/contact-us/forms
router.get('/forms', getAllContactForms);

// POST /api/contact-us/forms
router.post('/forms', createContactForm);

// ContactInfo CRUD routes
// CREATE
router.post('/info', createContactInfo);
// READ all
router.get('/info', getAllContactInfo);
// READ by ID
router.get('/info/:id', getContactInfoById);
// UPDATE by ID
router.put('/info/:id', updateContactInfo);
// DELETE by ID
router.delete('/info/:id', deleteContactInfo);

export default router;
