import OptimizeStrategy from '../models/sections/optimizeStrategy.js';
import mongoose from 'mongoose';

// Get all optimize strategies
const getAllStrategies = async (req, res) => {
    try {
        console.log('📊 Fetching all optimize strategies...');

        const strategies = await OptimizeStrategy.find()
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${strategies.length} strategies`);

        res.status(200).json({
            success: true,
            message: 'Strategies retrieved successfully',
            data: strategies,
            count: strategies.length
        });
    } catch (error) {
        console.error('❌ Error fetching strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategies',
            error: error.message
        });
    }
};

// Get paginated strategies
const getPaginatedStrategies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log(`📊 Fetching paginated strategies - Page: ${page}, Limit: ${limit}`);

        const strategies = await OptimizeStrategy.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await OptimizeStrategy.countDocuments();
        const totalPages = Math.ceil(total / limit);

        console.log(`✅ Found ${strategies.length} strategies (Page ${page}/${totalPages})`);

        res.status(200).json({
            success: true,
            message: 'Strategies retrieved successfully',
            data: strategies,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('❌ Error fetching paginated strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategies',
            error: error.message
        });
    }
};

// Search strategies
const searchStrategies = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        console.log(`🔍 Searching strategies with query: "${query}"`);

        const strategies = await OptimizeStrategy.searchStrategies(query);

        console.log(`✅ Found ${strategies.length} strategies matching search query`);

        res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: strategies,
            count: strategies.length,
            searchQuery: query
        });
    } catch (error) {
        console.error('❌ Error searching strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

// Get single strategy by ID
const getStrategyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid strategy ID'
            });
        }

        console.log(`📊 Fetching strategy with ID: ${id}`);

        const strategy = await OptimizeStrategy.findById(id);

        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        console.log(`✅ Strategy found: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy retrieved successfully',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error fetching strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategy',
            error: error.message
        });
    }
};

// Create new strategy
const createStrategy = async (req, res) => {
    try {
        console.log('📊 Creating new optimize strategy...');
        console.log('Request body:', req.body);

        const {
            heading,
            description,
            isActive = true
        } = req.body;

        // Validation
        if (!heading || heading.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        if (!description || description.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        // Create strategy data
        const strategyData = {
            heading: heading.trim(),
            description: description.trim(),
            isActive
        };

        const strategy = new OptimizeStrategy(strategyData);
        await strategy.save();

        console.log(`✅ Strategy created successfully: ${strategy.heading}`);

        res.status(201).json({
            success: true,
            message: 'Strategy created successfully',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error creating strategy:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create strategy',
            error: error.message
        });
    }
};

// Update strategy
const updateStrategy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid strategy ID'
            });
        }

        console.log(`📊 Updating strategy with ID: ${id}`);
        console.log('Update data:', req.body);

        const strategy = await OptimizeStrategy.findById(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        const {
            heading,
            description,
            isActive
        } = req.body;

        // Update fields
        if (heading !== undefined) strategy.heading = heading.trim();
        if (description !== undefined) strategy.description = description.trim();
        if (isActive !== undefined) strategy.isActive = isActive;

        await strategy.save();

        console.log(`✅ Strategy updated successfully: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy updated successfully',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error updating strategy:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update strategy',
            error: error.message
        });
    }
};

// Delete strategy
const deleteStrategy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid strategy ID'
            });
        }

        console.log(`🗑️ Deleting strategy with ID: ${id}`);

        const strategy = await OptimizeStrategy.findById(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        await OptimizeStrategy.findByIdAndDelete(id);

        console.log(`✅ Strategy deleted successfully: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete strategy',
            error: error.message
        });
    }
};

// Activate strategy (deactivates all others)
const activateStrategy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid strategy ID'
            });
        }

        console.log(`🎯 Activating strategy with ID: ${id}`);

        const strategy = await OptimizeStrategy.findById(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        // Deactivate all strategies first
        await OptimizeStrategy.updateMany({}, { isActive: false });

        // Activate the selected strategy
        strategy.isActive = true;
        await strategy.save();

        console.log(`✅ Strategy activated: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy activated successfully. All other strategies have been deactivated.',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error activating strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to activate strategy',
            error: error.message
        });
    }
};

// Deactivate strategy
const deactivateStrategy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid strategy ID'
            });
        }

        console.log(`🔇 Deactivating strategy with ID: ${id}`);

        const strategy = await OptimizeStrategy.findById(id);
        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        strategy.isActive = false;
        await strategy.save();

        console.log(`✅ Strategy deactivated: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy deactivated successfully',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error deactivating strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate strategy',
            error: error.message
        });
    }
};

// Get active strategy (for public display)
const getActiveStrategy = async (req, res) => {
    try {
        console.log('📊 Fetching active strategy...');

        const activeStrategy = await OptimizeStrategy.findOne({ isActive: true });

        if (!activeStrategy) {
            return res.status(404).json({
                success: false,
                message: 'No active strategy found'
            });
        }

        console.log(`✅ Active strategy found: ${activeStrategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Active strategy retrieved successfully',
            data: activeStrategy
        });
    } catch (error) {
        console.error('❌ Error fetching active strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active strategy',
            error: error.message
        });
    }
};

export {
    getAllStrategies,
    getPaginatedStrategies,
    searchStrategies,
    getStrategyById,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    activateStrategy,
    deactivateStrategy,
    getActiveStrategy
};
