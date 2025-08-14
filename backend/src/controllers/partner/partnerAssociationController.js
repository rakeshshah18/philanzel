import PartnerAssociationImage from '../../models/partner/partnerAssociationImage.js';
import path from 'path';

export const getAll = async (req, res) => {
    try {
        const images = await PartnerAssociationImage.find().sort({ createdAt: -1 });
        res.json({ data: images });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }
        const imageUrl = `/uploads/images/${req.file.filename}`;
        const alt = req.body.alt || '';
        const image = new PartnerAssociationImage({ url: imageUrl, alt });
        await image.save();
        res.status(201).json({ data: image });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add image' });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const image = await PartnerAssociationImage.findByIdAndDelete(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete image' });
    }
};
