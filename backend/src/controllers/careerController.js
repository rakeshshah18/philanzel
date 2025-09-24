import express from 'express';
import Career from '../models/career.js';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

// Function to verify reCAPTCHA token
const verifyCaptcha = async (token) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        
        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY not found in environment variables');
            return false;
        }

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();
        console.log('reCAPTCHA verification result:', data);
        
        return data.success;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
};

const careerInquery = async (req, res) => {
    try {
        // Debug: Log all received data
        console.log('=== CAREER INQUIRY DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.file);
        console.log('Captcha token received:', req.body.captchaToken);
        console.log('Environment RECAPTCHA_SECRET_KEY exists:', !!process.env.RECAPTCHA_SECRET_KEY);
        console.log('============================');

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available. Please check server logs.',
                hint: 'Make sure your IP is whitelisted in MongoDB Atlas'
            });
        }

        // Validate required fields
        const { fullName, email, phone, message, captchaToken } = req.body;

        if (!fullName || !email || !phone || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields (fullName, email, phone, message) are required'
            });
        }

        // Verify reCAPTCHA token (with development bypass)
        if (!captchaToken) {
            console.log('❌ No captcha token provided');
            
            // Development bypass
            if (process.env.NODE_ENV === 'development' && !process.env.RECAPTCHA_SECRET_KEY.startsWith('your_actual_')) {
                console.log('🔧 Development mode: Bypassing captcha verification');
                console.log('⚠️  Remember to set up real reCAPTCHA keys for production!');
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'reCAPTCHA verification is required'
                });
            }
        } else {
            console.log('🔍 Verifying captcha token:', captchaToken.substring(0, 20) + '...');
            
            // Check if using placeholder keys
            if (process.env.RECAPTCHA_SECRET_KEY === 'your_actual_secret_key_here') {
                console.log('⚠️  Using placeholder reCAPTCHA keys - bypassing verification');
                console.log('🔧 Please set up real reCAPTCHA keys for production!');
            } else {
                const isValidCaptcha = await verifyCaptcha(captchaToken);
                console.log('✅ Captcha verification result:', isValidCaptcha);
                
                if (!isValidCaptcha) {
                    console.log('❌ Captcha verification failed');
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid reCAPTCHA verification. Please try again.'
                    });
                }
            }
        }

        console.log('🎉 Proceeding with form submission for:', email);

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

        // Get search parameter from query
        const { search } = req.query;
        let query = {};

        // If search parameter exists, create search conditions
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i'); // Case-insensitive search
            query = {
                $or: [
                    { fullName: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                    { message: searchRegex }
                ]
            };
        }

        const applications = await Career.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: search ? `Career applications search results for "${search}"` : 'Career applications retrieved successfully',
            count: applications.length,
            searchTerm: search || null,
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

// Test endpoint for reCAPTCHA verification
const testCaptcha = async (req, res) => {
    try {
        const { captchaToken } = req.body;
        
        console.log('=== CAPTCHA TEST ===');
        console.log('Token received:', captchaToken);
        console.log('Secret key exists:', !!process.env.RECAPTCHA_SECRET_KEY);
        console.log('Secret key value:', process.env.RECAPTCHA_SECRET_KEY?.substring(0, 10) + '...');
        
        if (!captchaToken) {
            return res.status(400).json({
                status: 'error',
                message: 'No captcha token provided'
            });
        }
        
        const isValid = await verifyCaptcha(captchaToken);
        
        res.json({
            status: 'success',
            message: 'Captcha test completed',
            isValid,
            tokenReceived: !!captchaToken,
            secretKeyExists: !!process.env.RECAPTCHA_SECRET_KEY
        });
        
    } catch (error) {
        console.error('Captcha test error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Captcha test failed',
            error: error.message
        });
    }
};

export { careerInquery as default, getAllCareerApplications, testCaptcha };