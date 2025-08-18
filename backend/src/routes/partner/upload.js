import express from 'express';
import imageUpload from '../../config/imageUpload.js';
import path from 'path';

const router = express.Router();

// POST /api/upload - handle image upload
router.post('/', imageUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the public URL for the uploaded image
    const imageUrl = `/uploads/images/${req.file.filename}`;
    res.json({ url: imageUrl });
});

export default router;
