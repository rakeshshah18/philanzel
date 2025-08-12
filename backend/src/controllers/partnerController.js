import PartnerApplication from '../models/partner/partnerApplication.js';
import mongoose from 'mongoose';

// Submit partner application
const partnerInquiry = async (req, res) => {
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
        const { serviceName, personName, email, phone, message } = req.body;

        if (!serviceName || !personName || !email || !phone) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields (serviceName, personName, email, phone) are required'
            });
        }

        // Prepare partner application data
        const partnerData = {
            serviceName,
            personName,
            email,
            phone,
            message: message || ''
        };

        const newPartnerApplication = new PartnerApplication(partnerData);
        await newPartnerApplication.save();

        res.status(201).json({
            status: 'success',
            message: 'Partner application submitted successfully',
            data: {
                id: newPartnerApplication._id,
                serviceName: newPartnerApplication.serviceName,
                personName: newPartnerApplication.personName,
                email: newPartnerApplication.email,
                phone: newPartnerApplication.phone,
                message: newPartnerApplication.message,
                status: newPartnerApplication.status,
                createdAt: newPartnerApplication.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating partner application:', error);

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
            message: 'Failed to submit partner application. Please try again later.',
            error: error.message
        });
    }
};

// Get all partner applications (admin only)
export const getAllPartnerApplications = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                status: 'error',
                message: 'Database connection not available'
            });
        }

        const applications = await PartnerApplication.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            message: 'Partner applications retrieved successfully',
            count: applications.length,
            data: applications
        });

    } catch (error) {
        console.error('Error fetching partner applications:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch partner applications',
            error: error.message
        });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid application ID'
            });
        }

        const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status. Must be one of: pending, reviewed, approved, rejected'
            });
        }

        const application = await PartnerApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Partner application not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Application status updated successfully',
            data: application
        });

    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update application status',
            error: error.message
        });
    }
};

// Delete partner application
export const deletePartnerApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid application ID'
            });
        }

        const application = await PartnerApplication.findByIdAndDelete(id);

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Partner application not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Partner application deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting partner application:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete partner application',
            error: error.message
        });
    }
};

export default partnerInquiry;
