import EmpoweringIndividuals from '../../models/partner/empoweringIndividuals.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
// Configure Multer for image uploads
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join('uploads', 'empowering-individuals');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});
export const uploadEmpoweringImages = imageUpload.fields([
    { name: 'images', maxCount: 10 }
]);


// Create Empowering Individuals
export const createEmpoweringIndividual = async (req, res) => {
    try {
        const { commonDescription } = req.body;
        let content = req.body.content;
        if (typeof content === 'string') {
            content = JSON.parse(content);
        }
        if (!commonDescription || !content || !Array.isArray(content) || content.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input data'
            });
        }
        // Attach uploaded image paths to content
        if (req.files && req.files.images) {
            req.files.images.forEach((file, idx) => {
                if (content[idx]) {
                    content[idx].image = `/uploads/empowering-individuals/${file.filename}`;
                }
            });
        }
        const newEmpoweringIndividual = new EmpoweringIndividuals({
            commonDescription,
            content
        });
        await newEmpoweringIndividual.save();
        res.status(201).json({
            status: 'success',
            data: newEmpoweringIndividual
        });
    } catch (error) {
        console.error('Error creating empowering individual:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

// Get all Empowering Individuals
export const getAllEmpoweringIndividuals = async (req, res) => {
    try {
        const empoweringIndividuals = await EmpoweringIndividuals.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            data: empoweringIndividuals
        });
    } catch (error) {
        console.error('Error fetching empowering individuals:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
    }

    // Update Empowering Individual
    export const updateEmpoweringIndividual = async (req, res) => {
        try {
            const { id } = req.params;
            const { commonDescription } = req.body;
            let content = req.body.content;
            if (typeof content === 'string') {
                content = JSON.parse(content);
            }
            if (!commonDescription || !content || !Array.isArray(content) || content.length === 0) {
                return res.status(400).json({ status: 'error', message: 'Invalid input data' });
            }
            // Attach uploaded image paths to content
            if (req.files && req.files.images) {
                req.files.images.forEach((file, idx) => {
                    if (content[idx]) {
                        // Remove old image if exists
                        if (content[idx].image && content[idx].image.startsWith('/uploads/empowering-individuals/')) {
                            const oldPath = path.join(process.cwd(), content[idx].image);
                            if (fs.existsSync(oldPath)) {
                                fs.unlinkSync(oldPath);
                            }
                        }
                        content[idx].image = `/uploads/empowering-individuals/${file.filename}`;
                    }
                });
            }
            const updated = await EmpoweringIndividuals.findByIdAndUpdate(
                id,
                { commonDescription, content },
                { new: true }
            );
            if (!updated) {
                return res.status(404).json({ status: 'error', message: 'Not found' });
            }
            res.status(200).json({ status: 'success', data: updated });
        } catch (error) {
            console.error('Error updating empowering individual:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };

    // Delete Empowering Individual
    export const deleteEmpoweringIndividual = async (req, res) => {
        try {
            const { id } = req.params;
            const doc = await EmpoweringIndividuals.findById(id);
            if (!doc) {
                return res.status(404).json({ status: 'error', message: 'Not found' });
            }
            // Remove images from disk
            if (doc.content && Array.isArray(doc.content)) {
                doc.content.forEach(item => {
                    if (item.image && item.image.startsWith('/uploads/images/')) {
                        const imgPath = path.join(process.cwd(), item.image);
                        if (fs.existsSync(imgPath)) {
                            fs.unlinkSync(imgPath);
                        }
                    }
                });
            }
            await EmpoweringIndividuals.findByIdAndDelete(id);
            res.status(200).json({ status: 'success', message: 'Deleted successfully' });
        } catch (error) {
            console.error('Error deleting empowering individual:', error);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };
