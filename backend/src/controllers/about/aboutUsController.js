import AboutUs from '../../models/about/aboutUsModel.js';
import mongoose from 'mongoose';

// Create new about us content
const createAboutUs = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        // Validate required fields
        const { heading, description, button, image } = req.body;

        if (!heading || !description || !image) {
            return res.status(400).json({
                status: 'error',
                message: 'Heading, description, and image alt text are required'
            });
        }

        // Validate image alt text
        if (!image.altText) {
            return res.status(400).json({
                status: 'error',
                message: 'Image alt text is required for accessibility'
            });
        }

        // Prepare image data
        const imageData = {
            altText: image.altText
        };

        // Add file information if uploaded
        if (req.file) {
            imageData.originalName = req.file.originalname;
            imageData.filename = req.file.filename;
            imageData.path = req.file.path;
            imageData.size = req.file.size;
            imageData.mimetype = req.file.mimetype;
            imageData.url = `/uploads/images/${req.file.filename}`;
        } else if (image.url) {
            imageData.url = image.url;
        }

        // Prepare button data (optional)
        const buttonData = {};
        if (button && button.text) {
            buttonData.text = button.text;
            buttonData.link = button.link || '';
        }

        const aboutUsData = {
            heading,
            description,
            button: buttonData,
            image: imageData
        };

        const newAboutUs = new AboutUs(aboutUsData);
        await newAboutUs.save();

        res.status(201).json({
            status: 'success',
            message: 'About Us content created successfully',
            data: {
                id: newAboutUs._id,
                heading: newAboutUs.heading,
                description: newAboutUs.description,
                button: newAboutUs.button,
                image: newAboutUs.image,
                createdAt: newAboutUs.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating about us content:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'Duplicate entry found',
                error: 'A similar entry already exists'
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal server error while creating about us content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Get all about us content
const getAllAboutUs = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available',
                data: []
            });
        }

        const { page = 1, limit = 10, isActive, search } = req.query;

        // Build query
        let query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { heading: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await AboutUs.countDocuments(query);

        // Get about us content with pagination
        const aboutUsContent = await AboutUs.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-__v');

        res.status(200).json({
            status: 'success',
            message: 'About Us content retrieved successfully',
            data: aboutUsContent,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Error fetching about us content:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching about us content',
            data: [],
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Get about us content by ID
const getAboutUsById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid about us content ID'
            });
        }

        const aboutUsContent = await AboutUs.findById(id).select('-__v');

        if (!aboutUsContent) {
            return res.status(404).json({
                status: 'error',
                message: 'About Us content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'About Us content retrieved successfully',
            data: aboutUsContent
        });

    } catch (error) {
        console.error('Error fetching about us content by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching about us content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Update about us content
const updateAboutUs = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, description, button, image } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid about us content ID'
            });
        }

        // Find existing content
        const existingAboutUs = await AboutUs.findById(id);
        if (!existingAboutUs) {
            return res.status(404).json({
                status: 'error',
                message: 'About Us content not found'
            });
        }

        // Prepare update data
        const updateData = {};

        if (heading) updateData.heading = heading;
        if (description) updateData.description = description;

        // Update button if provided
        if (button) {
            updateData.button = {
                text: button.text || existingAboutUs.button?.text || '',
                link: button.link || existingAboutUs.button?.link || ''
            };
        }

        // Update image if provided
        if (image) {
            updateData.image = {
                ...existingAboutUs.image,
                altText: image.altText || existingAboutUs.image.altText
            };

            // Add new file information if uploaded
            if (req.file) {
                updateData.image.originalName = req.file.originalname;
                updateData.image.filename = req.file.filename;
                updateData.image.path = req.file.path;
                updateData.image.size = req.file.size;
                updateData.image.mimetype = req.file.mimetype;
                updateData.image.url = `/uploads/images/${req.file.filename}`;
            } else if (image.url) {
                updateData.image.url = image.url;
            }
        }

        const updatedAboutUs = await AboutUs.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            status: 'success',
            message: 'About Us content updated successfully',
            data: updatedAboutUs
        });

    } catch (error) {
        console.error('Error updating about us content:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Error updating about us content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Delete about us content
const deleteAboutUs = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid about us content ID'
            });
        }

        const deletedAboutUs = await AboutUs.findByIdAndDelete(id);

        if (!deletedAboutUs) {
            return res.status(404).json({
                status: 'error',
                message: 'About Us content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'About Us content deleted successfully',
            data: {
                id: deletedAboutUs._id,
                heading: deletedAboutUs.heading
            }
        });

    } catch (error) {
        console.error('Error deleting about us content:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting about us content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

export {
    createAboutUs,
    getAllAboutUs,
    getAboutUsById,
    updateAboutUs,
    deleteAboutUs
};
