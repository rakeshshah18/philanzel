import AdsSection from '../../models/sections/adsSection.js';
import mongoose from 'mongoose';

// Controller for Ads section

// Create new ads section
const createAdsSection = async (req, res) => {
    try {
        // Log the incoming request data for debugging
        console.log('Creating AdsSection with data:', JSON.stringify(req.body, null, 2));
        console.log('File info:', req.file);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        // Validate required fields
        const { title, description, hashtag, imageUrl, linkUrl, backgroundColor, isVisible } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                status: 'error',
                message: 'Title is required'
            });
        }

        // Handle uploaded image if present
        let finalImageUrl = imageUrl || '';
        if (req.file) {
            // If file was uploaded, use the uploaded file path
            finalImageUrl = `/uploads/images/${req.file.filename}`;
            console.log('Uploaded file path:', finalImageUrl);
        }

        // Create new ads section (made most fields optional)
        const newAdsSection = new AdsSection({
            title: title.trim(),
            description: description || '', // Don't trim HTML content, make optional
            hashtag: hashtag ? hashtag.trim() : '', // Optional
            imageUrl: finalImageUrl, // Image URL or uploaded file path
            linkUrl: linkUrl ? linkUrl.trim() : '', // Optional external link
            backgroundColor: backgroundColor || '#ffffff',
            isVisible: isVisible === 'true' || isVisible === true // Handle string/boolean conversion
        });

        await newAdsSection.save();

        res.status(201).json({
            status: 'success',
            message: 'Ads section created successfully',
            data: newAdsSection
        });
    } catch (error) {
        console.error('Error creating ads section:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to create ads section',
            error: error.message
        });
    }
};

// Helper function to migrate old data structure to new structure
const migrateAdsData = (adsSection) => {
    const migrated = { ...adsSection.toObject() };
    
    // Handle backward compatibility
    if (!migrated.imageUrl && (migrated.image || migrated.link)) {
        // If link contains 'image' or common image extensions, treat it as imageUrl
        if (migrated.link && (migrated.link.includes('image') || /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(migrated.link))) {
            migrated.imageUrl = migrated.link;
            migrated.linkUrl = migrated.linkUrl || '';
        } else {
            migrated.imageUrl = migrated.image || '';
            migrated.linkUrl = migrated.linkUrl || migrated.link || '';
        }
    }
    
    return migrated;
};

// Get all ads sections
const getAllAdsSections = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const adsSections = await AdsSection.find().sort({ createdAt: -1 });
        
        // Migrate old data structure for frontend compatibility
        const migratedAdsSections = adsSections.map(migrateAdsData);

        res.status(200).json({
            status: 'success',
            message: 'Ads sections retrieved successfully',
            data: migratedAdsSections,
            count: migratedAdsSections.length
        });
    } catch (error) {
        console.error('Error fetching ads sections:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve ads sections',
            error: error.message
        });
    }
};

// Get single ads section by ID
const getAdsSectionById = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ads section ID format'
            });
        }

        const adsSection = await AdsSection.findById(id);

        if (!adsSection) {
            return res.status(404).json({
                status: 'error',
                message: 'Ads section not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Ads section retrieved successfully',
            data: adsSection
        });
    } catch (error) {
        console.error('Error retrieving ads section:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve ads section',
            error: error.message
        });
    }
};

// Update ads section
const updateAdsSection = async (req, res) => {
    try {
        // Log the incoming request data for debugging
        console.log('Updating AdsSection with data:', JSON.stringify(req.body, null, 2));
        console.log('File info:', req.file);

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const { id } = req.params;
        const { title, description, hashtag, imageUrl, linkUrl, backgroundColor, isVisible } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ads section ID format'
            });
        }

        // Check if ads section exists
        const existingAdsSection = await AdsSection.findById(id);
        if (!existingAdsSection) {
            return res.status(404).json({
                status: 'error',
                message: 'Ads section not found'
            });
        }

        // Handle uploaded image if present
        let finalImageUrl = imageUrl;
        if (req.file) {
            // If file was uploaded, use the uploaded file path
            finalImageUrl = `/uploads/images/${req.file.filename}`;
            console.log('Uploaded file path:', finalImageUrl);
        }

        // Prepare update data
        const updateData = {};
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Title is required'
                });
            }
            updateData.title = title.trim();
        }
        if (description !== undefined) {
            updateData.description = description; // Allow empty description, don't trim HTML
        }
        if (hashtag !== undefined) {
            updateData.hashtag = hashtag ? hashtag.trim() : '';
        }
        if (finalImageUrl !== undefined) {
            updateData.imageUrl = finalImageUrl;
        }
        if (linkUrl !== undefined) {
            updateData.linkUrl = linkUrl ? linkUrl.trim() : '';
        }
        if (backgroundColor !== undefined) {
            updateData.backgroundColor = backgroundColor;
        }
        if (isVisible !== undefined) {
            updateData.isVisible = isVisible === 'true' || isVisible === true; // Handle string/boolean conversion
        }

        // Update ads section
        const updatedAdsSection = await AdsSection.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            message: 'Ads section updated successfully',
            data: updatedAdsSection
        });
    } catch (error) {
        console.error('Error updating ads section:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to update ads section',
            error: error.message
        });
    }
};

// Delete ads section
const deleteAdsSection = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ads section ID format'
            });
        }

        // Check if ads section exists
        const existingAdsSection = await AdsSection.findById(id);
        if (!existingAdsSection) {
            return res.status(404).json({
                status: 'error',
                message: 'Ads section not found'
            });
        }

        // Delete ads section
        await AdsSection.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Ads section deleted successfully',
            data: existingAdsSection
        });
    } catch (error) {
        console.error('Error deleting ads section:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete ads section',
            error: error.message
        });
    }
};

// Get ads sections with pagination
const getAdsSectionsWithPagination = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const adsSections = await AdsSection.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await AdsSection.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            status: 'success',
            message: 'Ads sections retrieved successfully',
            data: adsSections,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalCount: totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching ads sections with pagination:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve ads sections',
            error: error.message
        });
    }
};

// Search ads sections
const searchAdsSections = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        // Search in title, description, and hashtag
        const adsSections = await AdsSection.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { hashtag: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: `Found ${adsSections.length} ads sections matching "${query}"`,
            data: adsSections,
            searchQuery: query,
            count: adsSections.length
        });
    } catch (error) {
        console.error('Error searching ads sections:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search ads sections',
            error: error.message
        });
    }
};

export {
    createAdsSection,
    getAllAdsSections,
    getAdsSectionById,
    updateAdsSection,
    deleteAdsSection,
    getAdsSectionsWithPagination,
    searchAdsSections
};