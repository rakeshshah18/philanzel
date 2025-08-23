import OurServices from '../../models/service.js';

// Create a new service with dynamic sections
export const createService = async (req, res) => {
    try {
        const { name, description, image, isActive, sections } = req.body;
        const newService = new OurServices({
            name,
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
