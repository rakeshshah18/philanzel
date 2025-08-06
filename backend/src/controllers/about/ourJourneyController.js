import mongoose from 'mongoose';
import OurJourney from '../../models/about/ourJourney.js';

// Create new our journey content
const createOurJourney = async (req, res) => {
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
        const { heading, description, cards } = req.body;

        if (!heading || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Heading and description are required'
            });
        }

        // Validate cards if provided
        if (cards && Array.isArray(cards)) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (!card.year || !card.heading || !card.description) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Card ${i + 1}: Year, heading, and description are required`
                    });
                }
            }
        }

        const ourJourneyData = {
            heading,
            description,
            cards: cards || []
        };

        const newOurJourney = new OurJourney(ourJourneyData);
        await newOurJourney.save();

        res.status(201).json({
            status: 'success',
            message: 'Our Journey content created successfully',
            data: {
                id: newOurJourney._id,
                heading: newOurJourney.heading,
                description: newOurJourney.description,
                cards: newOurJourney.cards,
                createdAt: newOurJourney.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating our journey content:', error);

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
            message: 'Internal server error while creating our journey content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Get all our journey content
const getAllOurJourney = async (req, res) => {
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
                { description: { $regex: search, $options: 'i' } },
                { 'cards.heading': { $regex: search, $options: 'i' } },
                { 'cards.description': { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count
        const total = await OurJourney.countDocuments(query);

        // Get our journey content with pagination
        const ourJourneyContent = await OurJourney.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-__v');

        res.status(200).json({
            status: 'success',
            message: 'Our Journey content retrieved successfully',
            data: ourJourneyContent,
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
        console.error('Error fetching our journey content:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching our journey content',
            data: [],
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Get our journey content by ID
const getOurJourneyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid our journey content ID'
            });
        }

        const ourJourneyContent = await OurJourney.findById(id).select('-__v');

        if (!ourJourneyContent) {
            return res.status(404).json({
                status: 'error',
                message: 'Our Journey content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Our Journey content retrieved successfully',
            data: ourJourneyContent
        });

    } catch (error) {
        console.error('Error fetching our journey content by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching our journey content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Update our journey content
const updateOurJourney = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, description, cards } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid our journey content ID'
            });
        }

        // Find existing content
        const existingOurJourney = await OurJourney.findById(id);
        if (!existingOurJourney) {
            return res.status(404).json({
                status: 'error',
                message: 'Our Journey content not found'
            });
        }

        // Prepare update data
        const updateData = {};

        if (heading) updateData.heading = heading;
        if (description) updateData.description = description;

        // Validate and update cards if provided
        if (cards && Array.isArray(cards)) {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (!card.year || !card.heading || !card.description) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Card ${i + 1}: Year, heading, and description are required`
                    });
                }
            }
            updateData.cards = cards;
        }

        const updatedOurJourney = await OurJourney.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        res.status(200).json({
            status: 'success',
            message: 'Our Journey content updated successfully',
            data: updatedOurJourney
        });

    } catch (error) {
        console.error('Error updating our journey content:', error);

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
            message: 'Error updating our journey content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Delete our journey content
const deleteOurJourney = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid our journey content ID'
            });
        }

        const deletedOurJourney = await OurJourney.findByIdAndDelete(id);

        if (!deletedOurJourney) {
            return res.status(404).json({
                status: 'error',
                message: 'Our Journey content not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Our Journey content deleted successfully',
            data: {
                id: deletedOurJourney._id,
                heading: deletedOurJourney.heading
            }
        });

    } catch (error) {
        console.error('Error deleting our journey content:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting our journey content',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Add a new card to existing our journey content
const addCardToOurJourney = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, heading, description, order } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid our journey content ID'
            });
        }

        if (!year || !heading || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Year, heading, and description are required for the card'
            });
        }

        const ourJourneyContent = await OurJourney.findById(id);
        if (!ourJourneyContent) {
            return res.status(404).json({
                status: 'error',
                message: 'Our Journey content not found'
            });
        }

        const newCard = {
            year,
            heading,
            description,
            order: order || ourJourneyContent.cards.length
        };

        ourJourneyContent.cards.push(newCard);
        await ourJourneyContent.save();

        res.status(200).json({
            status: 'success',
            message: 'Card added successfully',
            data: ourJourneyContent
        });

    } catch (error) {
        console.error('Error adding card to our journey:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding card to our journey',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

// Remove a card from our journey content
const removeCardFromOurJourney = async (req, res) => {
    try {
        const { id, cardIndex } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid our journey content ID'
            });
        }

        const ourJourneyContent = await OurJourney.findById(id);
        if (!ourJourneyContent) {
            return res.status(404).json({
                status: 'error',
                message: 'Our Journey content not found'
            });
        }

        const index = parseInt(cardIndex);
        if (index < 0 || index >= ourJourneyContent.cards.length) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid card index'
            });
        }

        ourJourneyContent.cards.splice(index, 1);
        await ourJourneyContent.save();

        res.status(200).json({
            status: 'success',
            message: 'Card removed successfully',
            data: ourJourneyContent
        });

    } catch (error) {
        console.error('Error removing card from our journey:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error removing card from our journey',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
        });
    }
};

export {
    createOurJourney,
    getAllOurJourney,
    getOurJourneyById,
    updateOurJourney,
    deleteOurJourney,
    addCardToOurJourney,
    removeCardFromOurJourney
};
