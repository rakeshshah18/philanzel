import ContactInfo from '../../models/contactUs/contactInfo.js';

// CREATE ContactInfo
export async function createContactInfo(req, res) {
    try {
        const info = new ContactInfo(req.body);
        await info.save();
        res.status(201).json(info);
    } catch (error) {
        console.error('Error creating contact info:', error);
        res.status(500).json({ error: 'Failed to create contact info' });
    }
}

// READ all ContactInfo
export async function getAllContactInfo(req, res) {
    try {
        const infos = await ContactInfo.find().sort({ updatedAt: -1 });
        res.json(infos);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        res.status(500).json({ error: 'Failed to fetch contact info' });
    }
}

// READ single ContactInfo by ID
export async function getContactInfoById(req, res) {
    try {
        const info = await ContactInfo.findById(req.params.id);
        if (!info) return res.status(404).json({ error: 'Contact info not found' });
        res.json(info);
    } catch (error) {
        console.error('Error fetching contact info by ID:', error);
        res.status(500).json({ error: 'Failed to fetch contact info by ID' });
    }
}

// UPDATE ContactInfo by ID
export async function updateContactInfo(req, res) {
    try {
        const info = await ContactInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!info) return res.status(404).json({ error: 'Contact info not found' });
        res.json(info);
    } catch (error) {
        console.error('Error updating contact info:', error);
        res.status(500).json({ error: 'Failed to update contact info' });
    }
}

// DELETE ContactInfo by ID
export async function deleteContactInfo(req, res) {
    try {
        const info = await ContactInfo.findByIdAndDelete(req.params.id);
        if (!info) return res.status(404).json({ error: 'Contact info not found' });
        res.json({ message: 'Contact info deleted' });
    } catch (error) {
        console.error('Error deleting contact info:', error);
        res.status(500).json({ error: 'Failed to delete contact info' });
    }
}
export async function createContactForm(req, res) {
    try {
        const { name, email, message, servicesType } = req.body;
        const form = new ContactForm({ name, email, message, servicesType });
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        console.error('Error creating contact form submission:', error);
        res.status(500).json({ error: 'Failed to create contact form submission' });
    }
}
import ContactForm from '../../models/contactUs/contactForm.js';

export async function getAllContactForms(req, res) {
    try {
        const { term, date } = req.query;
        let filter = {};
        if (term) {
            const regex = new RegExp(term, 'i');
            filter.$or = [
                { name: regex },
                { email: regex },
                { servicesType: regex }
            ];
        }
        if (date) {
            // Expect date in YYYY-MM-DD format, treat as UTC
            const [year, month, day] = date.split('-').map(Number);
            const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
            filter.createdAt = { $gte: start, $lte: end };
        }
        const forms = await ContactForm.find(filter).sort({ createdAt: -1 });
        res.json(forms);
    } catch (error) {
        console.error('Error fetching contact form submissions:', error);
        res.status(500).json({ error: 'Failed to fetch contact form submissions' });
    }
}
