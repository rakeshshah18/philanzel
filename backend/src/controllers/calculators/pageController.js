import CalculatorPage from '../../models/calculators/calculatorPages.js';

// Get all calculator pages
export const getAllPages = async (req, res) => {
    try {
        const pages = await CalculatorPage.find();
        res.status(200).json({ success: true, data: pages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch pages', error: err.message });
    }
};

// Get a single page by ID
export const getPageById = async (req, res) => {
    try {
        const page = await CalculatorPage.findById(req.params.id);
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        res.status(200).json({ success: true, data: page });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch page', error: err.message });
    }
};

// Create a new calculator page
export const createPage = async (req, res) => {
    try {
        const { name } = req.body;
        const page = new CalculatorPage({ name });
        await page.save();
        res.status(201).json({ success: true, data: page });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to create page', error: err.message });
    }
};

// Update a calculator page
export const updatePage = async (req, res) => {
    try {
        const { name } = req.body;
        const page = await CalculatorPage.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        res.status(200).json({ success: true, data: page });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to update page', error: err.message });
    }
};

// Delete a calculator page
export const deletePage = async (req, res) => {
    try {
        const page = await CalculatorPage.findByIdAndDelete(req.params.id);
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        res.status(200).json({ success: true, message: 'Page deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to delete page', error: err.message });
    }
};
