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
            icon: imagePath // Use same image for icon
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

// Test function to create a default service for debugging
export const createTestService = async (req, res) => {
    try {
        console.log('Creating 9 default tabbing services...');

        // First, clear existing services
        await OurServices.deleteMany({});
        console.log('Cleared existing services');

        const defaultServices = [
            {
                name: 'Investment Planning',
                title: 'Investment Planning',
                tabTitle: 'Investment',
                contentTitle: 'Smart Investment Planning',
                description: 'Build wealth through strategic investment planning tailored to your financial goals and risk tolerance.',
                buttonText: 'Start Investing',
                color: 'primary',
                order: 1
            },
            {
                name: 'Retirement Solutions',
                title: 'Retirement Solutions',
                tabTitle: 'Retirement',
                contentTitle: 'Secure Your Future',
                description: 'Plan today for a comfortable tomorrow with our comprehensive retirement planning services.',
                buttonText: 'Plan Retirement',
                color: 'success',
                order: 2
            },
            {
                name: 'Tax Planning',
                title: 'Tax Planning',
                tabTitle: 'Tax Strategy',
                contentTitle: 'Optimize Your Taxes',
                description: 'Minimize your tax burden with expert tax planning strategies and year-round support.',
                buttonText: 'Reduce Taxes',
                color: 'info',
                order: 3
            },
            {
                name: 'Insurance Services',
                title: 'Insurance Services',
                tabTitle: 'Insurance',
                contentTitle: 'Protect What Matters',
                description: 'Comprehensive insurance solutions to protect your family, business, and financial future.',
                buttonText: 'Get Protected',
                color: 'warning',
                order: 4
            },
            {
                name: 'Estate Planning',
                title: 'Estate Planning',
                tabTitle: 'Estate',
                contentTitle: 'Legacy Protection',
                description: 'Preserve and transfer your wealth efficiently with professional estate planning services.',
                buttonText: 'Plan Legacy',
                color: 'dark',
                order: 5
            },
            {
                name: 'Business Advisory',
                title: 'Business Advisory',
                tabTitle: 'Business',
                contentTitle: 'Business Growth Solutions',
                description: 'Strategic business advisory services to help your company grow and succeed.',
                buttonText: 'Grow Business',
                color: 'danger',
                order: 6
            },
            {
                name: 'Wealth Management',
                title: 'Wealth Management',
                tabTitle: 'Wealth',
                contentTitle: 'Comprehensive Wealth Management',
                description: 'Holistic wealth management services for high-net-worth individuals and families.',
                buttonText: 'Manage Wealth',
                color: 'secondary',
                order: 7
            },
            {
                name: 'Financial Planning',
                title: 'Financial Planning',
                tabTitle: 'Planning',
                contentTitle: 'Complete Financial Planning',
                description: 'Comprehensive financial planning to help you achieve all your life goals.',
                buttonText: 'Start Planning',
                color: 'primary',
                order: 8
            },
            {
                name: 'Risk Management',
                title: 'Risk Management',
                tabTitle: 'Risk',
                contentTitle: 'Smart Risk Management',
                description: 'Identify, assess, and mitigate financial risks to protect your assets and investments.',
                buttonText: 'Manage Risk',
                color: 'success',
                order: 9
            }
        ];

        const createdServices = [];
        for (const serviceData of defaultServices) {
            const service = new OurServices({
                ...serviceData,
                image: '/images/services/default-service.svg',
                icon: '/images/services/default-service.svg'
            });

            const savedService = await service.save();
            createdServices.push(savedService);
            console.log(`Created service: ${serviceData.title}`);
        }

        console.log(`Successfully created ${createdServices.length} tabbing services`);

        return res.status(201).json({
            status: 'success',
            message: `Created ${createdServices.length} default tabbing services`,
            data: createdServices
        });
    } catch (error) {
        console.error('Error creating default services:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create default services',
            error: error.message
        });
    }
};