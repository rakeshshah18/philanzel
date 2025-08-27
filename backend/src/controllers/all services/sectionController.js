import Section from '../../models/all services/section.js';

// Create a new section
export const createSection = async (req, res) => {
    try {
        const section = new Section(req.body);
        await section.save();
        res.status(201).json({ success: true, data: section });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all sections
export const getAllSections = async (req, res) => {
    try {
        const sections = await Section.find();
        res.json({ success: true, data: sections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single section by ID
export const getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.json({ success: true, data: section });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a section
export const updateSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.json({ success: true, data: section });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a section
export const deleteSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
        res.json({ success: true, message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
