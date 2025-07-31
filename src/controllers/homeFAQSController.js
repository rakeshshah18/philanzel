import HomeFAQs from '../models/homeFAQs.js';
import mongoose from 'mongoose';

// Create new FAQ section
const createHomeFAQ = async (req, res) => {
    try {
        // Log the incoming request data for debugging
        console.log('Creating HomeFAQ with data:', JSON.stringify(req.body, null, 2));

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        // Validate required fields
        const { heading, description, faqs } = req.body;

        if (!heading || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Heading and description are required'
            });
        }

        if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one FAQ (question and answer) is required'
            });
        }

        // Validate each FAQ
        for (let i = 0; i < faqs.length; i++) {
            const faq = faqs[i];
            if (!faq.question || !faq.question.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: `Question is required for FAQ ${i + 1}`
                });
            }
            if (!faq.answer || !faq.answer.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: `Answer is required for FAQ ${i + 1}`
                });
            }
        }

        // Create new FAQ section
        const newFAQSection = new HomeFAQs({
            heading: heading.trim(),
            description: description.trim(),
            faqs: faqs.map(faq => ({
                question: faq.question.trim(),
                answer: faq.answer.trim()
            }))
        });

        await newFAQSection.save();

        res.status(201).json({
            status: 'success',
            message: 'FAQ section created successfully',
            data: newFAQSection
        });
    } catch (error) {
        console.error('Error creating FAQ section:', error);

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            console.log('Validation errors:', validationErrors);
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed: ' + validationErrors.join(', '),
                errors: validationErrors
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to create FAQ section',
            error: error.message
        });
    }
};

// Get all FAQ sections
const getAllHomeFAQs = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const faqSections = await HomeFAQs.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: 'FAQ sections retrieved successfully',
            count: faqSections.length,
            data: faqSections
        });
    } catch (error) {
        console.error('Error retrieving FAQ sections:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve FAQ sections',
            error: error.message
        });
    }
};

// Get single FAQ by ID
const getHomeFAQById = async (req, res) => {
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
                message: 'Invalid FAQ ID format'
            });
        }

        const faq = await HomeFAQs.findById(id);

        if (!faq) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'FAQ retrieved successfully',
            data: faq
        });
    } catch (error) {
        console.error('Error retrieving FAQ:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve FAQ',
            error: error.message
        });
    }
};

// Update FAQ section
const updateHomeFAQ = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.'
            });
        }

        const { id } = req.params;
        const { heading, description, faqs } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid FAQ section ID format'
            });
        }

        // Check if FAQ section exists
        const existingFAQSection = await HomeFAQs.findById(id);
        if (!existingFAQSection) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ section not found'
            });
        }

        // Prepare update data
        const updateData = {};
        if (heading !== undefined) {
            if (!heading || !heading.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Heading is required'
                });
            }
            updateData.heading = heading.trim();
        }
        if (description !== undefined) {
            if (!description || !description.trim()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Description is required'
                });
            }
            updateData.description = description.trim();
        }
        if (faqs !== undefined) {
            if (!Array.isArray(faqs)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'FAQs must be an array'
                });
            }
            if (faqs.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'At least one FAQ (question and answer) is required'
                });
            }

            // Validate each FAQ
            for (let i = 0; i < faqs.length; i++) {
                const faq = faqs[i];
                if (!faq.question || !faq.question.trim()) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Question is required for FAQ ${i + 1}`
                    });
                }
                if (!faq.answer || !faq.answer.trim()) {
                    return res.status(400).json({
                        status: 'error',
                        message: `Answer is required for FAQ ${i + 1}`
                    });
                }
            }

            updateData.faqs = faqs.map(faq => ({
                question: faq.question.trim(),
                answer: faq.answer.trim()
            }));
        }

        // Update FAQ section
        const updatedFAQSection = await HomeFAQs.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            message: 'FAQ section updated successfully',
            data: updatedFAQSection
        });
    } catch (error) {
        console.error('Error updating FAQ section:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to update FAQ section',
            error: error.message
        });
    }
};// Delete FAQ
const deleteHomeFAQ = async (req, res) => {
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
                message: 'Invalid FAQ ID format'
            });
        }

        // Check if FAQ exists
        const existingFAQ = await HomeFAQs.findById(id);
        if (!existingFAQ) {
            return res.status(404).json({
                status: 'error',
                message: 'FAQ not found'
            });
        }

        // Delete FAQ
        await HomeFAQs.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'FAQ deleted successfully',
            data: existingFAQ
        });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete FAQ',
            error: error.message
        });
    }
};

// Search FAQ sections by heading, description, questions or answers
const searchHomeFAQs = async (req, res) => {
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

        // Search in heading, description, and FAQ questions/answers
        const faqSections = await HomeFAQs.find({
            $or: [
                { heading: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { 'faqs.question': { $regex: query, $options: 'i' } },
                { 'faqs.answer': { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: `Found ${faqSections.length} FAQ section(s) matching your search`,
            count: faqSections.length,
            data: faqSections
        });
    } catch (error) {
        console.error('Error searching FAQ sections:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search FAQ sections',
            error: error.message
        });
    }
};

// Get FAQs with pagination
const getHomeFAQsWithPagination = async (req, res) => {
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

        // Get total count
        const totalFAQs = await HomeFAQs.countDocuments();
        const totalPages = Math.ceil(totalFAQs / limit);

        // Get paginated FAQs
        const faqs = await HomeFAQs.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            message: 'FAQs retrieved successfully',
            data: faqs,
            pagination: {
                currentPage: page,
                totalPages,
                totalFAQs,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null
            }
        });
    } catch (error) {
        console.error('Error retrieving FAQs with pagination:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to retrieve FAQs',
            error: error.message
        });
    }
};

export {
    createHomeFAQ,
    getAllHomeFAQs,
    getHomeFAQById,
    updateHomeFAQ,
    deleteHomeFAQ,
    searchHomeFAQs,
    getHomeFAQsWithPagination
};
