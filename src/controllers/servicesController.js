import OurServices from '../models/service.js';

const createServices = async (req, res) => {
    try {
        const {name} = req.body;
        const existingServices = await OurServices.find({ name: name.trim() });
        if (existingServices) {
            return res.status(400).json({
                status: 'error',
                message: 'Service with this name already exists'
            });
        }
        //Add new service
        const newServices = new OurServices({
            name: name.trim()
        });
        await newServices.save();
        return res.status(201).json({
            status: 'success',
            message: 'Service created successfully',
            data: newServices
        });
    }catch (error) {
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
        const services = await OurServices.find();
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
        const { name } = req.body;
        const existingServices = await OurServices.findById(id);
        if (!existingServices) {
            return res.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }
        existingServices.name = name.trim();
        await existingServices.save();
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
        const existingServices = await OurServices.findById(id);
        if (!existingServices) {
            return res.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }
        await existingServices.remove();
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