import PartnerPost from '../../models/partner/partnerPost.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

console.log('🎯 partnerPostController.js loaded successfully');

// Get all partner posts
export const getAllPartnerPosts = async (req, res) => {
    try {
        console.log('📋 Fetching all partner posts...');

        if (mongoose.connection.readyState !== 1) {
            console.log('❌ Database connection not available');
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available'
            });
        }

        const partnerPosts = await PartnerPost.find().sort({ createdAt: -1 });
        console.log(`✅ Found ${partnerPosts.length} partner posts`);

        res.status(200).json({
            status: 'success',
            message: 'Partner posts retrieved successfully',
            count: partnerPosts.length,
            data: partnerPosts
        });

    } catch (error) {
        console.error('Error fetching partner posts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch partner posts',
            error: error.message
        });
    }
};

// Get single partner post
export const getPartnerPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid partner post ID'
            });
        }

        const partnerPost = await PartnerPost.findById(id);

        if (!partnerPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Partner post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Partner post retrieved successfully',
            data: partnerPost
        });

    } catch (error) {
        console.error('Error fetching partner post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch partner post',
            error: error.message
        });
    }
};

// Create new partner post
export const createPartnerPost = async (req, res) => {
    // console.log('🎯 createPartnerPost called! Request body:', req.body);
    // console.log('🎯 This means the route is working!');

    try {
        console.log('📥 Partner post creation request received:', req.body);

        const { heading, thought, description } = req.body;

        if (!heading || !thought || !description) {
            console.log('❌ Validation failed - missing fields:', { heading: !!heading, thought: !!thought, description: !!description });
            return res.status(400).json({
                status: 'error',
                message: 'Heading, thought, and description are required'
            });
        }

        const partnerPostData = {
            heading: heading.trim(),
            thought: thought.trim(),
            description: description.trim()
        };

        console.log('📝 Creating partner post with data:', partnerPostData);

        const newPartnerPost = new PartnerPost(partnerPostData);
        const savedPost = await newPartnerPost.save();

        console.log('✅ Partner post created successfully:', savedPost._id);

        res.status(201).json({
            status: 'success',
            message: 'Partner post created successfully',
            data: {
                _id: savedPost._id,
                heading: savedPost.heading,
                thought: savedPost.thought,
                description: savedPost.description,
                createdAt: savedPost.createdAt
            }
        });

    } catch (error) {
        console.error('❌ Error creating partner post:', error);
        console.error('Stack trace:', error.stack);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            console.log('📋 Validation errors:', errors);

            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Failed to create partner post',
            error: error.message
        });
    }
};

// Update partner post
export const updatePartnerPost = async (req, res) => {
    try {
        console.log('📝 Partner post update request received:', req.params.id, req.body);

        const { id } = req.params;
        const { heading, thought, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ Invalid partner post ID:', id);
            return res.status(400).json({
                status: 'error',
                message: 'Invalid partner post ID'
            });
        }

        const existingPost = await PartnerPost.findById(id);
        if (!existingPost) {
            console.log('❌ Partner post not found:', id);
            return res.status(404).json({
                status: 'error',
                message: 'Partner post not found'
            });
        }

        const updateData = {
            heading: heading?.trim() || existingPost.heading,
            thought: thought?.trim() || existingPost.thought,
            description: description?.trim() || existingPost.description
        };

        console.log('📝 Updating partner post with data:', updateData);

        const updatedPost = await PartnerPost.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        console.log('✅ Partner post updated successfully:', updatedPost._id);

        res.status(200).json({
            status: 'success',
            message: 'Partner post updated successfully',
            data: {
                _id: updatedPost._id,
                heading: updatedPost.heading,
                thought: updatedPost.thought,
                description: updatedPost.description,
                updatedAt: updatedPost.updatedAt
            }
        });

    } catch (error) {
        console.error('Error updating partner post:', error);

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
            message: 'Failed to update partner post',
            error: error.message
        });
    }
};

// Delete partner post
export const deletePartnerPost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid partner post ID'
            });
        }

        const partnerPost = await PartnerPost.findById(id);
        if (!partnerPost) {
            return res.status(404).json({
                status: 'error',
                message: 'Partner post not found'
            });
        }

        // Delete partner post from database
        await PartnerPost.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Partner post deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting partner post:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete partner post',
            error: error.message
        });
    }
};
