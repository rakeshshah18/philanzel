
import WhyChoosePhilanzel from '../../models/partner/whyChoosePhilanzel.js';
import multer from 'multer';

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
export const upload = multer({ storage });

// Create a new entry
export const createWhyChoosePhilanzel = async (req, res) => {
    try {
        const { heading, description, points } = req.body;
        let image = '';
        if (req.file) {
            image = req.file.filename;
        }
        const newEntry = new WhyChoosePhilanzel({ heading, description, image, points });
        await newEntry.save();
        res.status(201).json({ status: 'success', data: newEntry });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all entries
export const getAllWhyChoosePhilanzel = async (req, res) => {
    try {
        const entries = await WhyChoosePhilanzel.find();
        res.status(200).json({ status: 'success', data: entries });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get single entry by ID
export const getWhyChoosePhilanzelById = async (req, res) => {
    try {
        const entry = await WhyChoosePhilanzel.findById(req.params.id);
        if (!entry) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', data: entry });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update entry by ID
export const updateWhyChoosePhilanzel = async (req, res) => {
    try {
        const { heading, description, points } = req.body;
        let updateData = { heading, description, points };
        if (typeof points === 'string') {
            try {
                updateData.points = JSON.parse(points);
            } catch (e) {
                updateData.points = [];
            }
        }
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const updated = await WhyChoosePhilanzel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ status: 'error', message: 'Not found' });
        }
        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Delete entry by ID
export const deleteWhyChoosePhilanzel = async (req, res) => {
    try {
        const deleted = await WhyChoosePhilanzel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
