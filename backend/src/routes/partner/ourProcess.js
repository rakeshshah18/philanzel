import express from 'express';
import {
    createOurProcess,
    getAllOurProcesses,
    getOurProcessById,
    updateOurProcess,
    deleteOurProcess
} from '../../controllers/partner/ourProcessController.js';
import upload from '../../config/multer.js';
import imageUpload from '../../config/imageUpload.js';

const router = express.Router();


// CREATE
router.post('/', imageUpload.array('icon'), createOurProcess);

// READ ALL
router.get('/', getAllOurProcesses);
router.get('/public', getAllOurProcesses);

// READ ONE
router.get('/:id', getOurProcessById);

// UPDATE
router.put('/:id', imageUpload.array('icon'), updateOurProcess);

// DELETE
router.delete('/:id', deleteOurProcess);

export default router;
