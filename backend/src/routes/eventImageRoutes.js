
import express from 'express';
import eventImageUpload from '../config/eventImageMulter.js';
import eventImageController from '../controllers/eventImageController.js';

const router = express.Router();


// GET all event images
router.get('/', (req, res, next) => {
    console.log('GET /event-images hit');
    next();
}, eventImageController.getEventImages);
// POST upload event image
router.post('/upload', (req, res, next) => {
    console.log('POST /event-images/upload hit (multiple)');
    next();
}, eventImageUpload.array('images', 10), eventImageController.uploadMultipleEventImages);
// DELETE event image
router.delete('/:id', (req, res, next) => {
    console.log('DELETE /event-images/' + req.params.id + ' hit');
    next();
}, eventImageController.deleteEventImage);

export default router;
