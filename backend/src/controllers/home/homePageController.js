import HomePage from '../../models/home/homePageModel.js';
import mongoose from 'mongoose';

// Create new homepage content
const createHomePage = async (req, res) => {
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

        if (!heading || !description || !button || !image) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields (heading, description, button, image) are required'
            });
        }

        // Validate nested objects
        if (!button.text || !button.link) {
            return res.status(400).json({
                status: 'error',
                message: 'Button text and link are required'
            });
        }

        if (!image.altText) {
            return res.status(400).json({
                status: 'error',
                message: 'Image alt text is required'
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
            // Prefer an explicit server URL from environment (set this in Render/production).
            // Fallback to the request host when the env var isn't provided (keeps local dev working).
            const serverBase = process.env.SERVER_BASE_URL || process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
            imageData.url = `${serverBase}/uploads/images/${req.file.filename}`;
        } else if (image.url) {
            imageData.url = image.url;
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Either upload an image file or provide an image URL'
            });
        }

        const homePageData = {
            heading,
            description,
            button: {
                text: button.text,
                link: button.link
            },
            image: imageData
        };

        const newHomePage = new HomePage(homePageData);
        await newHomePage.save();

        res.status(201).json({
            status: 'success',
            message: 'Homepage content created successfully',
            data: {
                id: newHomePage._id,
                heading: newHomePage.heading,
                description: newHomePage.description,
                button: newHomePage.button,
                image: newHomePage.image,
                createdAt: newHomePage.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating homepage content:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Failed to create homepage content',
            error: error.message
        });
    }
};

// Get all homepage content
const getAllHomePages = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const homePages = await HomePage.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: 'Homepage content retrieved successfully',
            count: homePages.length,
            data: homePages
        });

    } catch (error) {
        console.error('Error fetching homepage content:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch homepage content',
            error: error.message
        });
    }
};

// Get homepage content by ID
const getHomePageById = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid homepage ID format'
            });
        }

        const homePage = await HomePage.findById(id);

        if (!homePage) {
            return res.status(404).json({
                status: 'error',
                message: 'Homepage content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Homepage content retrieved successfully',
            data: homePage
        });

    } catch (error) {
        console.error('Error fetching homepage content:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch homepage content',
            error: error.message
        });
    }
};

// Update homepage content
const updateHomePage = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const { id } = req.params;

        // Debug logging
        console.log('--- updateHomePage called ---');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // Handle both nested objects and flat form fields
        const heading = req.body.heading;
        const description = req.body.description;
        const button = req.body.button || {
            text: req.body['button[text]'],
            link: req.body['button[link]']
        };
        const image = req.body.image || {
            url: req.body['image[url]'],
            altText: req.body['image[altText]']
        };

        console.log('Parsed button:', button);
        console.log('Parsed image:', image);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid homepage ID format'
            });
        }

        // Find existing homepage content
        const existingHomePage = await HomePage.findById(id);
        if (!existingHomePage) {
            return res.status(404).json({
                status: 'error',
                message: 'Homepage content not found'
            });
        }

        const updateData = {};
        if (heading) updateData.heading = heading;
        if (description) updateData.description = description;
        if (button && (button.text || button.link)) updateData.button = button;

        // Handle image updates
        if (image && (image.url || image.altText)) {
            const imageData = {
                altText: image.altText || existingHomePage.image?.altText
            };

            // Add file information if uploaded
            if (req.file) {
                imageData.originalName = req.file.originalname;
                imageData.filename = req.file.filename;
                imageData.path = req.file.path;
                imageData.size = req.file.size;
                imageData.mimetype = req.file.mimetype;
                // Use env-configured server base when available (recommended for production).
                const serverBase = process.env.SERVER_BASE_URL || process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
                imageData.url = `${serverBase}/uploads/images/${req.file.filename}`;
            } else if (image.url) {
                // Use the provided image URL
                imageData.url = image.url;
                // Clear file-related fields when using external URL
                imageData.originalName = null;
                imageData.filename = null;
                imageData.path = null;
                imageData.size = null;
                imageData.mimetype = null;
            } else {
                // Keep existing file data if no new file uploaded and no URL provided
                imageData.originalName = existingHomePage.image?.originalName;
                imageData.filename = existingHomePage.image?.filename;
                imageData.path = existingHomePage.image?.path;
                imageData.size = existingHomePage.image?.size;
                imageData.mimetype = existingHomePage.image?.mimetype;
                imageData.url = existingHomePage.image?.url;
            }

            console.log('Final imageData:', imageData);
            updateData.image = imageData;
        }

        const updatedHomePage = await HomePage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Homepage content updated successfully',
            data: updatedHomePage
        });

    } catch (error) {
        console.error('Error updating homepage content:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Failed to update homepage content',
            error: error.message
        });
    }
};

// Delete homepage content
const deleteHomePage = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid homepage ID format'
            });
        }

        const deletedHomePage = await HomePage.findByIdAndDelete(id);

        if (!deletedHomePage) {
            return res.status(404).json({
                status: 'error',
                message: 'Homepage content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Homepage content deleted successfully',
            data: deletedHomePage
        });

    } catch (error) {
        console.error('Error deleting homepage content:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete homepage content',
            error: error.message
        });
    }
};

export {
    createHomePage,
    getAllHomePages,
    getHomePageById,
    updateHomePage,
    deleteHomePage
};
