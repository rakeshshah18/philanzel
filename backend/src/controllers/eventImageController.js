
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

    // Upload a new event image
    uploadEventImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            const imageUrl = `/uploads/events/${req.file.filename}`;
            const image = new EventImage({ imageUrl });
            await image.save();
            res.json({ success: true, data: image });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to upload image' });
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
