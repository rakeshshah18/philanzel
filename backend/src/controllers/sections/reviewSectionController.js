import ReviewSection from '../../models/sections/reviewSection.js';
import mongoose from 'mongoose';

class ReviewSectionController {
    // Create new review section
    async create(req, res) {
        try {
            // Check if database is connected
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Database connection not available. Please check server logs.'
                });
            }

            const {
                heading,
                description,
                reviewProvider,
                writeReviewButton,
                reviews = []
            } = req.body;

            // Validate required fields
            if (!heading || !description || !writeReviewButton?.url) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Heading, description, and write review URL are required'
                });
            }

            // Create new review section
            const newReviewSection = new ReviewSection({
                heading: heading.trim(),
                description: description.trim(),
                reviewProvider,
                writeReviewButton,
                reviews
            });

            await newReviewSection.save();

            res.status(201).json({
                status: 'success',
                message: 'Review section created successfully',
                data: newReviewSection
            });
        } catch (error) {
            console.error('Error creating review section:', error);

            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed: ' + validationErrors.join(', '),
                    errors: validationErrors
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Failed to create review section',
                error: error.message
            });
        }
    }

    // Get all review sections
    async getAll(req, res) {
        try {
            // Check if database is connected
            if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Database connection not available'
                });
            }

            const reviewSections = await ReviewSection.find()
                .sort({ displayOrder: 1, createdAt: -1 });

            res.status(200).json({
                status: 'success',
                count: reviewSections.length,
                data: reviewSections
            });
        } catch (error) {
            console.error('Error fetching review sections:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch review sections',
                error: error.message
            });
        }
    }

    // Get active review sections (public)
    async getActive(req, res) {
        try {
            const reviewSections = await ReviewSection.getActiveReviewSections();

            // Filter to show only visible reviews
            const publicReviewSections = reviewSections.map(section => ({
                ...section.toObject(),
                reviews: section.getVisibleReviews()
            }));

            res.status(200).json({
                status: 'success',
                count: publicReviewSections.length,
                data: publicReviewSections
            });
        } catch (error) {
            console.error('Error fetching active review sections:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch review sections',
                error: error.message
            });
        }
    }

    // Get single review section by ID
    async getById(req, res) {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid review section ID format'
                });
            }

            const reviewSection = await ReviewSection.findById(id);

            if (!reviewSection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review section not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: reviewSection
            });
        } catch (error) {
            console.error('Error retrieving review section:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve review section',
                error: error.message
            });
        }
    }

    // Update review section
    async update(req, res) {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid review section ID format'
                });
            }

            // Check if review section exists
            const existingReviewSection = await ReviewSection.findById(id);
            if (!existingReviewSection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review section not found'
                });
            }

            // Update the document properties manually to trigger pre-save middleware
            Object.keys(req.body).forEach(key => {
                if (key !== '_id' && key !== '__v') {
                    existingReviewSection[key] = req.body[key];
                }
            });

            // Save the document to trigger pre-save middleware (which calculates averageRating)
            const updatedReviewSection = await existingReviewSection.save();

            res.status(200).json({
                status: 'success',
                message: 'Review section updated successfully',
                data: updatedReviewSection
            });
        } catch (error) {
            console.error('Error updating review section:', error);

            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed: ' + validationErrors.join(', '),
                    errors: validationErrors
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Failed to update review section',
                error: error.message
            });
        }
    }

    // Add review to existing section
    async addReview(req, res) {
        try {
            const { id } = req.params;
            const reviewData = req.body;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid review section ID format'
                });
            }

            const reviewSection = await ReviewSection.findById(id);
            if (!reviewSection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review section not found'
                });
            }

            // Add review using the instance method
            await reviewSection.addReview(reviewData);

            res.status(200).json({
                status: 'success',
                message: 'Review added successfully',
                data: reviewSection
            });
        } catch (error) {
            console.error('Error adding review:', error);

            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed: ' + validationErrors.join(', '),
                    errors: validationErrors
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Failed to add review',
                error: error.message
            });
        }
    }

    // Delete review section
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid review section ID format'
                });
            }

            const reviewSection = await ReviewSection.findById(id);
            if (!reviewSection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Review section not found'
                });
            }

            await ReviewSection.findByIdAndDelete(id);

            res.status(200).json({
                status: 'success',
                message: 'Review section deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting review section:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to delete review section',
                error: error.message
            });
        }
    }

    // Recalculate all review section ratings
    async recalculateRatings(req, res) {
        try {
            console.log('Starting rating recalculation for all review sections...');

            const reviewSections = await ReviewSection.find();
            let updatedCount = 0;

            for (const section of reviewSections) {
                console.log(`Processing section: ${section.heading}`);
                console.log(`Current average: ${section.averageRating}, Current count: ${section.totalReviewCount}`);

                // Get visible reviews
                const visibleReviews = section.reviews.filter(review => review.isVisible);
                console.log(`Visible reviews: ${visibleReviews.length}, All reviews: ${section.reviews.length}`);

                if (visibleReviews.length > 0) {
                    const reviewRatings = visibleReviews.map(r => r.rating);
                    console.log(`Review ratings: [${reviewRatings.join(', ')}]`);

                    const totalStars = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
                    const average = totalStars / visibleReviews.length;
                    const roundedAverage = Math.round(average * 10) / 10;

                    console.log(`Calculated: Total stars: ${totalStars}, Average: ${average}, Rounded: ${roundedAverage}`);

                    // Update the section
                    section.averageRating = roundedAverage;
                    section.totalReviewCount = visibleReviews.length;
                    await section.save();

                    console.log(`Updated section ${section.heading}: ${roundedAverage} (${visibleReviews.length} reviews)`);
                    updatedCount++;
                } else {
                    section.averageRating = 0;
                    section.totalReviewCount = 0;
                    await section.save();
                    console.log(`Updated section ${section.heading}: 0.0 (0 reviews)`);
                    updatedCount++;
                }
            }

            res.status(200).json({
                status: 'success',
                message: `Successfully recalculated ratings for ${updatedCount} review sections`,
                data: {
                    totalSections: reviewSections.length,
                    updatedSections: updatedCount
                }
            });
        } catch (error) {
            console.error('Error recalculating ratings:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to recalculate ratings',
                error: error.message
            });
        }
    }
}

export default new ReviewSectionController();
