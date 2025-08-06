import News from '../models/news.js';
import mongoose from 'mongoose';

// Create new news article
const createNews = async (req, res) => {
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
        const { title, content, category, status, thumbnail, author, tags, featured } = req.body;

        if (!title || !content || !category || !thumbnail) {
            return res.status(400).json({
                status: 'error',
                message: 'Title, content, category, and thumbnail are required'
            });
        }

        // Validate thumbnail object
        if (!thumbnail.altText) {
            return res.status(400).json({
                status: 'error',
                message: 'Thumbnail alt text is required'
            });
        }

        // Prepare thumbnail data
        const thumbnailData = {
            altText: thumbnail.altText
        };

        // Add file information if uploaded
        if (req.file) {
            thumbnailData.originalName = req.file.originalname;
            thumbnailData.filename = req.file.filename;
            thumbnailData.path = req.file.path;
            thumbnailData.size = req.file.size;
            thumbnailData.mimetype = req.file.mimetype;
            thumbnailData.url = `/uploads/images/${req.file.filename}`;
        }

        // Parse tags if provided as string
        let tagsArray = [];
        if (tags) {
            if (typeof tags === 'string') {
                tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(tags)) {
                tagsArray = tags;
            }
        }

        // Create new news article
        const newsData = {
            title,
            content,
            category,
            status: status || 'Draft',
            thumbnail: thumbnailData,
            author: author || 'Admin',
            tags: tagsArray,
            featured: featured === 'true' || featured === true
        };

        const newNews = new News(newsData);
        await newNews.save();

        res.status(201).json({
            status: 'success',
            message: 'News article created successfully',
            data: newNews
        });

    } catch (error) {
        console.error('Error creating news article:', error);

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

        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A news article with this title already exists'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Failed to create news article',
            error: error.message
        });
    }
};

// Get all news articles
const getAllNews = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const status = req.query.status;
        const search = req.query.search;

        // Build filter object
        const filter = {};
        if (category && category !== 'all') filter.category = category;
        if (status && status !== 'all') filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Get total count for pagination
        const total = await News.countDocuments(filter);

        // Get news articles with pagination
        const news = await News.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            message: 'News articles retrieved successfully',
            data: news,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching news articles:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch news articles',
            error: error.message
        });
    }
};

// Get news article by ID
const getNewsById = async (req, res) => {
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
                message: 'Invalid news ID format'
            });
        }

        const news = await News.findById(id);

        if (!news) {
            return res.status(404).json({
                status: 'error',
                message: 'News article not found'
            });
        }

        // Increment view count
        await News.findByIdAndUpdate(id, { $inc: { views: 1 } });

        res.status(200).json({
            status: 'success',
            message: 'News article retrieved successfully',
            data: news
        });

    } catch (error) {
        console.error('Error fetching news article:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch news article',
            error: error.message
        });
    }
};

// Update news article
const updateNews = async (req, res) => {
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
        const { title, content, category, status, thumbnail, author, tags, featured } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid news ID format'
            });
        }

        // Find existing news article
        const existingNews = await News.findById(id);
        if (!existingNews) {
            return res.status(404).json({
                status: 'error',
                message: 'News article not found'
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (category) updateData.category = category;
        if (status) updateData.status = status;
        if (author) updateData.author = author;
        if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;

        // Handle tags
        if (tags) {
            if (typeof tags === 'string') {
                updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(tags)) {
                updateData.tags = tags;
            }
        }

        // Handle thumbnail updates
        if (thumbnail) {
            const thumbnailData = {
                altText: thumbnail.altText || existingNews.thumbnail?.altText
            };

            // Add file information if uploaded
            if (req.file) {
                thumbnailData.originalName = req.file.originalname;
                thumbnailData.filename = req.file.filename;
                thumbnailData.path = req.file.path;
                thumbnailData.size = req.file.size;
                thumbnailData.mimetype = req.file.mimetype;
                thumbnailData.url = `/uploads/images/${req.file.filename}`;
            } else {
                // Keep existing file data if no new file uploaded
                thumbnailData.originalName = existingNews.thumbnail?.originalName;
                thumbnailData.filename = existingNews.thumbnail?.filename;
                thumbnailData.path = existingNews.thumbnail?.path;
                thumbnailData.size = existingNews.thumbnail?.size;
                thumbnailData.mimetype = existingNews.thumbnail?.mimetype;
                thumbnailData.url = existingNews.thumbnail?.url;
            }

            updateData.thumbnail = thumbnailData;
        }

        const updatedNews = await News.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'News article updated successfully',
            data: updatedNews
        });

    } catch (error) {
        console.error('Error updating news article:', error);

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

        if (error.code === 11000) {
            return res.status(400).json({
                status: 'error',
                message: 'A news article with this title already exists'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Failed to update news article',
            error: error.message
        });
    }
};

// Delete news article
const deleteNews = async (req, res) => {
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
                message: 'Invalid news ID format'
            });
        }

        const deletedNews = await News.findByIdAndDelete(id);

        if (!deletedNews) {
            return res.status(404).json({
                status: 'error',
                message: 'News article not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'News article deleted successfully',
            data: deletedNews
        });

    } catch (error) {
        console.error('Error deleting news article:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to delete news article',
            error: error.message
        });
    }
};

// Get news categories
const getCategories = async (req, res) => {
    try {
        const categories = ['Architecture', 'Interior Design', 'Exterior Design', 'Construction', 'Technology', 'General'];

        res.status(200).json({
            status: 'success',
            message: 'Categories retrieved successfully',
            data: categories
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

export {
    createNews,
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    getCategories
};
