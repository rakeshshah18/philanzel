import OurProcess from '../../models/partner/ourProcess.js';
import mongoose from 'mongoose';

// Create steps / process
// CREATE
export const createOurProcess = async (req, res) => {
    try {
        // req.body.steps is expected to be an array
        let steps = req.body.steps;
        if (typeof steps === 'string') {
            steps = JSON.parse(steps);
        }

        // Attach icon filenames to each step
        if (req.files && req.files.length > 0) {
            steps = steps.map((step, idx) => ({
                ...step,
                icon: req.files[idx] ? `/uploads/images/${req.files[idx].filename}` : step.icon || ''
            }));
        }

        const ourProcess = new OurProcess({
            heading: req.body.heading,
            description: req.body.description,
            steps
        });

        const savedProcess = await ourProcess.save();

        res.status(201).json({
            status: 'success',
            message: 'Our process step created successfully',
            data: savedProcess
        });

    } catch (error) {
        console.error('Error creating our process step:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create our process step',
            error: error.message
        });
    }
};

// READ ALL
export const getAllOurProcesses = async (req, res) => {
    try {
        const processes = await OurProcess.find();
        res.status(200).json({ status: 'success', data: processes });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// READ ONE
export const getOurProcessById = async (req, res) => {
    try {
        const process = await OurProcess.findById(req.params.id);
        if (!process) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', data: process });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// UPDATE
export const updateOurProcess = async (req, res) => {
    try {
        let steps = req.body.steps;
        if (typeof steps === 'string') {
            steps = JSON.parse(steps);
        }
        if (req.files && req.files.length > 0) {
            steps = steps.map((step, idx) => ({
                ...step,
                icon: req.files[idx] ? `/uploads/images/${req.files[idx].filename}` : step.icon || ''
            }));
        }
        const updated = await OurProcess.findByIdAndUpdate(
            req.params.id,
            {
                heading: req.body.heading,
                description: req.body.description,
                steps
            },
            { new: true }
        );
        if (!updated) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', data: updated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE
export const deleteOurProcess = async (req, res) => {
    try {
        const deleted = await OurProcess.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Not found' });
        res.status(200).json({ status: 'success', message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};