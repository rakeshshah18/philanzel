import OurServices from '../../models/service.js';
import AboutService from '../../models/all services/aboutService.js';

// Create a new service with dynamic sections
export const createService = async (req, res) => {
    try {
        const { name, description, image, isActive, sections } = req.body;
        const slug = name.replace(/\s+/g, '-').toLowerCase();
        const newService = new OurServices({
            name,
            slug,
            description,
            image,
            isActive,
            sections: Array.isArray(sections) ? sections : [],
        });
        await newService.save();
        res.status(201).json({ success: true, message: 'Service created', data: newService });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create service', error: error.message });
    }
};

// Get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await OurServices.find({ isActive: true });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message });
    }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
    try {
        const service = await OurServices.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message });
    }
};

// Get a single service by slug
export const getServiceBySlug = async (req, res) => {
    try {
        const service = await OurServices.findOne({ slug: req.params.slug });
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch service by slug', error: error.message });
    }
};

// Add AboutService section to a service
export const addSectionToService = async (req, res) => {
    try {
        const { serviceName } = req.params;
        const { sectionId } = req.body;
        console.log('AddSectionToService: serviceName param:', serviceName);
        if (!sectionId) {
            return res.status(400).json({ success: false, message: 'Section ID required' });
        }
        // Find the section
        const section = await AboutService.findById(sectionId);
        if (!section) {
            console.log('AddSectionToService: Section not found:', sectionId);
            return res.status(404).json({ success: false, message: 'Section not found' });
        }
        // Find the service by slug
        const service = await OurServices.findOne({ slug: serviceName });
        console.log('AddSectionToService: Service query result:', service);
        if (!service) {
            console.log('AddSectionToService: Service not found for slug:', serviceName);
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        // Prevent duplicate sections (by sectionId)
        const alreadyExists = service.sections.some(s => s._id?.toString() === section._id.toString());
        if (alreadyExists) {
            return res.status(400).json({ success: false, message: 'Section already added to this service.' });
        }
        service.sections.push({
            title: section.heading,
            content: section.description,
            image: section.image || '',
            _id: section._id
        });
        await service.save();
        res.json({ success: true, message: 'Section added to service', service });
    } catch (err) {
        console.log('AddSectionToService: Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update a service and its sections
export const updateService = async (req, res) => {
    try {
        const { name, description, image, isActive, sections } = req.body;
        const service = await OurServices.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        service.name = name ?? service.name;
        service.description = description ?? service.description;
        service.image = image ?? service.image;
        service.isActive = isActive ?? service.isActive;
        if (Array.isArray(sections)) service.sections = sections;
        await service.save();
        res.status(200).json({ success: true, message: 'Service updated', data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update service', error: error.message });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const service = await OurServices.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete service', error: error.message });
    }
};
