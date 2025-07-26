import express from 'express';
import Career from '../models/career.js';
import mongoose from 'mongoose';

const careerInquery = async (req, res) => {
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
        const { fullName, email, phone, message } = req.body;

        if (!fullName || !email || !phone || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields (fullName, email, phone, message) are required'
            });
        }

        // Prepare career inquiry data
        const careerData = {
            fullName,
            email,
            phone,
            message
        };

        // Add resume information if file was uploaded
        if (req.file) {
            careerData.resume = {
                originalName: req.file.originalname,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
            };
        }

        const newCareerInquery = new Career(careerData);
        await newCareerInquery.save();

        res.status(201).json({
            status: 'success',
            message: 'Career inquiry created successfully',
            data: {
                id: newCareerInquery._id,
                fullName: newCareerInquery.fullName,
                email: newCareerInquery.email,
                phone: newCareerInquery.phone,
                message: newCareerInquery.message,
                resumeUploaded: !!req.file,
                resumeInfo: req.file ? {
                    originalName: req.file.originalname,
                    size: req.file.size,
                    type: req.file.mimetype,
                    fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                } : null,
                createdAt: newCareerInquery.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating career inquiry:', error);

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
            message: 'Failed to create career inquiry',
            error: error.message
        });
    }
};

const getAllCareerApplications = async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        const applications = await Career.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: 'Career applications retrieved successfully',
            count: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Error fetching career applications:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch career applications',
            error: error.message
        });
    }
};

export { careerInquery as default, getAllCareerApplications };