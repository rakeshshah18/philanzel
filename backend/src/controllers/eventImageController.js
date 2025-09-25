
import EventImage from '../models/eventImage.js';
import path from 'path';
import fs from 'fs';

const eventImageController = {
    // Get all event images
    getEventImages: async (req, res) => {
        try {
            const images = await EventImage.find().sort({ createdAt: -1 });
            res.json({ success: true, data: images });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to fetch images' });
        }
    },


    // Upload multiple event images
    uploadMultipleEventImages: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: 'No files uploaded' });
            }
            const images = await Promise.all(req.files.map(async (file) => {
                const imageUrl = `/uploads/events/${file.filename}`;
                const image = new EventImage({ imageUrl });
                await image.save();
                return image;
            }));
            res.json({ success: true, data: images });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to upload images' });
        }
    },

    // Delete an event image
    deleteEventImage: async (req, res) => {
        try {
            const image = await EventImage.findByIdAndDelete(req.params.id);
            if (!image) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }
            // Optionally, remove the file from disk
            const filePath = path.join(process.cwd(), 'uploads/events/', path.basename(image.imageUrl));
            fs.unlink(filePath, err => { }); // ignore error
            res.json({ success: true, message: 'Image deleted' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to delete image' });
        }
    }
};

export default eventImageController;
