// Add section to service by _id
export const addSectionToServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { sectionId } = req.body;
        if (!sectionId) {
            return res.status(400).json({ success: false, message: 'Section ID required' });
        }
        // Find the section
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ success: false, message: 'Section not found', sectionId });
        }
        // Find the service by _id
        const service = await OurServices.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found', serviceId });
        }
        // Add section to service.sections
        service.sections.push({
            title: Array.isArray(section.heading) ? section.heading[0] : section.heading,
            content: Array.isArray(section.description) ? section.description[0] : section.description,
            image: Array.isArray(section.images) && section.images.length ? section.images[0] : (section.image || '')
        });
        await service.save();
        res.json({ success: true, message: 'Section added to service', service });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
import OurServices from '../models/service.js';

const createServices = async (req, res) => {
    try {
        const {
            name,
            description,
            title,
            tabTitle,
            contentTitle,
            buttonText,
            color
        } = req.body;

        // For backward compatibility, use title as name if name not provided
        const serviceName = name || title;
        const serviceTitle = title || name;

        if (!serviceName || !serviceTitle) {
            return res.status(400).json({
                status: 'error',
                message: 'Service name/title is required'
            });
        }

        // Handle image upload
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/images/${req.file.filename}`;
        }

        // Generate slug from name/title if not provided
        let slug = req.body.slug;
        if (!slug) {
            slug = (serviceName || serviceTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        // Add new service
        const newServices = new OurServices({
            name: serviceName.trim(),
            title: serviceTitle.trim(),
            tabTitle: (tabTitle || serviceTitle).trim(),
            contentTitle: (contentTitle || serviceTitle).trim(),
            description: description ? description.trim() : '',
            buttonText: buttonText || 'Learn More',
            color: color || 'primary',
            image: imagePath,
            icon: imagePath, // Use same image for icon
            slug: slug
        });

        await newServices.save();
        return res.status(201).json({
            status: 'success',
            message: 'Service created successfully',
            data: newServices
        });
    } catch (error) {
        console.error('Error creating service:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to create service',
            error: error.message
        });
    }
};

//get all services
const getAllServices = async (req, res) => {
    try {
        const services = await OurServices.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
        res.status(200).json({
            status: 'success',
            message: 'Services retrieved successfully',
            data: services
        });
    } catch (error) {
        console.error('Error retrieving services:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve services',
            error: error.message
        });
    }
};

// update service
const updateServices = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            title,
            tabTitle,
            contentTitle,
            buttonText,
            color
        } = req.body;

        console.log('Update request for service ID:', id);
        console.log('Request body:', req.body);
        console.log('File uploaded:', req.file ? req.file.filename : 'No file');

        const existingServices = await OurServices.findById(id);
        if (!existingServices) {
            return res.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        console.log('Existing service:', existingServices);

        // Update fields (check for both null/undefined and empty string)
        if (name !== undefined && name !== null) existingServices.name = name.trim();
        if (title !== undefined && title !== null) existingServices.title = title.trim();
        if (tabTitle !== undefined && tabTitle !== null) existingServices.tabTitle = tabTitle.trim();
        if (contentTitle !== undefined && contentTitle !== null) existingServices.contentTitle = contentTitle.trim();
        if (description !== undefined) existingServices.description = description ? description.trim() : '';
        if (buttonText !== undefined && buttonText !== null) existingServices.buttonText = buttonText.trim();
        if (color !== undefined && color !== null) existingServices.color = color;

        // Handle image upload
        if (req.file) {
            const imagePath = `/uploads/images/${req.file.filename}`;
            existingServices.image = imagePath;
            existingServices.icon = imagePath; // Use same image for icon
            console.log('Updated image path:', imagePath);
        }

        console.log('About to save updated service:', existingServices);
        await existingServices.save();

        console.log('Service updated successfully');
        return res.status(200).json({
            status: 'success',
            message: 'Service updated successfully',
            data: existingServices
        });
    } catch (error) {
        console.error('Error updating service:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to update service',
            error: error.message
        });
    }
};

// delete service
const deleteServices = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete request received for service ID:', id);

        const existingServices = await OurServices.findByIdAndDelete(id);
        console.log('Database result:', existingServices);

        if (!existingServices) {
            console.log('Service not found with ID:', id);
            return res.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        console.log('Service deleted successfully:', existingServices._id);
        return res.status(200).json({
            status: 'success',
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete service',
            error: error.message
        });
    }
};

// export functions
export {
    createServices,
    getAllServices,
    updateServices,
    deleteServices
};

// Test function to create a default service for debugging

// Add AboutService section to a service
import Section from '../models/all services/section.js';
export const addSectionToService = async (req, res) => {
    try {
        const { serviceName } = req.params;
        const { sectionId } = req.body;
        console.log('[AddSectionToService] Received:', { serviceName, sectionId });
        if (!sectionId) {
            console.log('[AddSectionToService] No sectionId provided');
            return res.status(400).json({ success: false, message: 'Section ID required' });
        }
        // Find the section
        const section = await Section.findById(sectionId);
        console.log('[AddSectionToService] Found section:', section);
        if (!section) {
            console.log('[AddSectionToService] Section not found for id:', sectionId);
            return res.status(404).json({ success: false, message: 'Section not found', sectionId });
        }
        // Find the service
        const service = await OurServices.findOne({ name: serviceName });
        console.log('[AddSectionToService] Found service:', service);
        if (!service) {
            console.log('[AddSectionToService] Service not found for name:', serviceName);
            return res.status(404).json({ success: false, message: 'Service not found', serviceName });
        }
        // Add section to service.sections (store minimal info or full section)
        service.sections.push({
            title: Array.isArray(section.heading) ? section.heading[0] : section.heading,
            content: Array.isArray(section.description) ? section.description[0] : section.description,
            image: Array.isArray(section.images) && section.images.length ? section.images[0] : (section.image || '')
        });
        await service.save();
        console.log('[AddSectionToService] Section added successfully');
        res.json({ success: true, message: 'Section added to service', service });
    } catch (err) {
        console.log('[AddSectionToService] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};