import PartnerFAQ from '../../models/partner/partnerFAQs.js';

// Create new Partner FAQ
export const createPartnerFAQ = async (req, res) => {
    try {
        const { heading, description, faqs } = req.body;
        const faqDoc = new PartnerFAQ({ heading, description, faqs });
        await faqDoc.save();
        res.status(201).json({ status: 'success', data: faqDoc });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all Partner FAQs
export const getAllPartnerFAQs = async (req, res) => {
    try {
        const faqs = await PartnerFAQ.find();
        res.status(200).json({ status: 'success', data: faqs });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get single Partner FAQ by ID
export const getPartnerFAQById = async (req, res) => {
    try {
        const faq = await PartnerFAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', data: faq });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update Partner FAQ by ID
export const updatePartnerFAQ = async (req, res) => {
    try {
        const { heading, description, faqs } = req.body;
        const updated = await PartnerFAQ.findByIdAndUpdate(
            req.params.id,
            { heading, description, faqs },
            { new: true }
        );
        if (!updated) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Delete Partner FAQ by ID
export const deletePartnerFAQ = async (req, res) => {
    try {
        const deleted = await PartnerFAQ.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
