// Edit a section in a calculator page's embedded sections array
export const editSectionInPage = async (req, res) => {
    try {
        const { id, sectionId } = req.params;
        const updateData = req.body;
        const page = await CalculatorPage.findById(id);
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        const section = page.sections.id(sectionId);
        if (!section) return res.status(404).json({ success: false, message: 'Section not found in page' });
        Object.assign(section, updateData);
        await page.save();
        res.status(200).json({ success: true, data: section });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to edit section', error: err.message });
    }
};

// Delete a section from a calculator page's embedded sections array
export const deleteSectionFromPage = async (req, res) => {
    try {
        const { id, sectionId } = req.params;
        const page = await CalculatorPage.findById(id);
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        const initialLength = page.sections.length;
        page.sections = page.sections.filter(s => String(s._id) !== String(sectionId));
        if (page.sections.length === initialLength) return res.status(404).json({ success: false, message: 'Section not found in page' });
        await page.save();
        res.status(200).json({ success: true, message: 'Section deleted' });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to delete section', error: err.message });
    }
};
// Add a section to a calculator page by id
export const addSectionToPage = async (req, res) => {
    try {
        console.log('AddSectionToPage called');
        const { id } = req.params;
        const { sectionId } = req.body;
        console.log('Page ID:', id);
        console.log('Section ID:', sectionId);
        const page = await CalculatorPage.findById(id);
        if (!page) {
            console.log('Page not found');
            return res.status(404).json({ success: false, message: 'Page not found' });
        }
        console.log('Current sections:', page.sections);
        // Fetch full section data
        const section = await import('../../models/calculators/calculatorSections.js').then(m => m.default.findById(sectionId));
        if (!section) {
            console.log('Section not found');
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        // Check if already added by _id
        if (!page.sections.some(s => String(s._id) === String(section._id))) {
            page.sections.push({
                _id: section._id,
                sectionName: section.sectionName,
                heading: section.heading,
                content: section.content,
                faqs: section.faqs || []
            });
            await page.save();
            console.log('Section added');
        } else {
            console.log('Section already exists in page');
        }
        res.status(200).json({ success: true, data: page });
    } catch (error) {
        console.error('Error in addSectionToPage:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get a calculator page by slug (with populated sections)
export const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await CalculatorPage.findOne({ slug }).populate('sections');
        if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
        res.status(200).json(page);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
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
