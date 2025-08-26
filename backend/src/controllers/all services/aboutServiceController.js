import AboutService from '../../models/all services/aboutService.js';

export const createAboutService = async (req, res) => {
    try {
        const { image, heading, description } = req.body;
        const aboutService = new AboutService({ image, heading, description });
        await aboutService.save();
        res.status(201).json({ success: true, data: aboutService });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllAboutServices = async (req, res) => {
    try {
        const sections = await AboutService.find();
        res.status(200).json({ success: true, data: sections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAboutServiceById = async (req, res) => {
    try {
        const section = await AboutService.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.status(200).json({ success: true, data: section });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAboutService = async (req, res) => {
    try {
        const { image, heading, description } = req.body;
        const section = await AboutService.findByIdAndUpdate(
            req.params.id,
            { image, heading, description },
            { new: true }
        );
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.status(200).json({ success: true, data: section });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAboutService = async (req, res) => {
    try {
        const section = await AboutService.findByIdAndDelete(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.status(200).json({ success: true, message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createAboutService,
    getAllAboutServices,
    getAboutServiceById,
    updateAboutService,
    deleteAboutService
};
