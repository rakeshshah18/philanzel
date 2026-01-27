import CareerPost from '../models/career/career.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Get all career posts
export const getAllCareerPosts = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available'
            });
        }

        const careerPosts = await CareerPost.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: 'Career posts retrieved successfully',
            count: careerPosts.length,
            data: careerPosts
        });

    } catch (error) {
        console.error('Error fetching career posts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch career posts',
            error: error.message
        });
    }
};

// Get single career post
export const getCareerPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid career post ID'
            });
        }

        const careerPost = await CareerPost.findById(id);

        if (!careerPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Career post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Career post retrieved successfully',
            data: careerPost
        });

    } catch (error) {
        console.error('Error fetching career post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch career post',
            error: error.message
        });
    }
};

// Create new career post
export const createCareerPost = async (req, res) => {
    try {
        const { heading, description } = req.body;

        if (!heading || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Heading and description are required'
            });
        }

        const careerPostData = {
            heading: heading.trim(),
            description: description.trim()
        };

        // Add image information if file was uploaded or URL provided
        if (req.file) {
            careerPostData.image = {
                originalName: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/images/${req.file.filename}`
            };
        } else if (req.body['image[url]']) {
            // Handle image URL from FormData bracket notation
            careerPostData.image = {
                url: req.body['image[url]']
            };
            console.log('Image URL provided:', req.body['image[url]']);
        }

        const newCareerPost = new CareerPost(careerPostData);
        await newCareerPost.save();

        res.status(201).json({
            status: 'success',
            message: 'Career post created successfully',
            data: {
                id: newCareerPost._id,
                heading: newCareerPost.heading,
                description: newCareerPost.description,
                image: newCareerPost.image,
                imageUrl: req.file ? `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}` : null,
                createdAt: newCareerPost.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating career post:', error);

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

        res.status(500).json({
            status: 'error',
            message: 'Failed to create career post',
            error: error.message
        });
    }
};

// Update career post
export const updateCareerPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid career post ID'
            });
        }

        const existingPost = await CareerPost.findById(id);
        if (!existingPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Career post not found'
            });
        }

        const updateData = {};
        if (heading) updateData.heading = heading.trim();
        if (description) updateData.description = description.trim();

        // Handle image update (file or URL)
        if (req.file) {
            // Delete old image if exists
            if (existingPost.image && existingPost.image.path) {
                try {
                    fs.unlinkSync(existingPost.image.path);
                } catch (err) {
                    console.warn('Failed to delete old image:', err.message);
                }
            }

            updateData.image = {
                originalName: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: `/uploads/images/${req.file.filename}`
            };
        } else if (req.body['image[url]']) {
            // Handle image URL from FormData bracket notation
            updateData.image = {
                url: req.body['image[url]']
            };
            console.log('Image URL updated:', req.body['image[url]']);
        }

        const updatedPost = await CareerPost.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Career post updated successfully',
            data: {
                id: updatedPost._id,
                heading: updatedPost.heading,
                description: updatedPost.description,
                image: updatedPost.image,
                imageUrl: updatedPost.image ? `${req.protocol}://${req.get('host')}/uploads/images/${updatedPost.image.filename}` : null,
                createdAt: updatedPost.createdAt
            }
        });

    } catch (error) {
        console.error('Error updating career post:', error);

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

        res.status(500).json({
            status: 'error',
            message: 'Failed to update career post',
            error: error.message
        });
    }
};

// Delete career post
export const deleteCareerPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid career post ID'
            });
        }

        const careerPost = await CareerPost.findById(id);
        if (!careerPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Career post not found'
            });
        }

        // Delete associated image if exists
        if (careerPost.image && careerPost.image.path) {
            try {
                fs.unlinkSync(careerPost.image.path);
            } catch (err) {
                console.warn('Failed to delete image file:', err.message);
            }
        }

        await CareerPost.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Career post deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting career post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete career post',
            error: error.message
        });
    }
};
