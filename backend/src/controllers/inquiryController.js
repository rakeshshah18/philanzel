import express from 'express';
import NewUserInquiry from '../models/new_user_inquiry.js';
import mongoose from 'mongoose';

const createNewUserInquiry = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const inquiry = new NewUserInquiry(req.body);
        await inquiry.save();

        res.status(201).json({
            status: 'success',
            message: 'Inquiry created successfully',
            data: inquiry
        });
    } catch (error) {
        console.error('Error creating inquiry:', error);

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
            message: 'Failed to create inquiry',
            error: error.message
        });
    }
};

export default createNewUserInquiry;
