import OurTrack from "../../models/home/ourTrack.js";

const postOurTrack = async (req, res) => {
    try {
        const { yearExp, totalExpert, planningDone, happyCustomers } = req.body;

        // Validation
        if (yearExp === undefined || totalExpert === undefined || planningDone === undefined || happyCustomers === undefined) {
            return res.status(400).json({
                status: "error",
                message: "All fields (yearExp, totalExpert, planningDone, happyCustomers) are required"
            });
        }

        // Type validation
        if (typeof yearExp !== 'number' || typeof totalExpert !== 'number' ||
            typeof planningDone !== 'number' || typeof happyCustomers !== 'number') {
            return res.status(400).json({
                status: "error",
                message: "All fields must be numbers"
            });
        }

        // Check if data already exists (since this is typically a singleton)
        const existingTrack = await OurTrack.findOne();
        if (existingTrack) {
            return res.status(409).json({
                status: "error",
                message: "OurTrack data already exists. Use update instead.",
                data: existingTrack
            });
        }

        const newTrack = new OurTrack({
            yearExp,
            totalExpert,
            planningDone,
            happyCustomers
        });

        await newTrack.save();

        res.status(201).json({
            status: "success",
            message: "OurTrack data created successfully",
            data: newTrack
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            status: "error",
            message: "Failed to create OurTrack data",
            error: error.message
        });
    }
};

const getOurTrack = async (req, res) => {
    try {
        const ourTrackData = await OurTrack.findOne();
        if (!ourTrackData) {
            return res.status(404).json({
                status: "error",
                message: "No OurTrack data found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "OurTrack data retrieved successfully",
            data: ourTrackData
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve OurTrack data",
            error: error.message
        });
    }
}

const updateOurTrack = async (req, res) => {
    try {
        const { yearExp, totalExpert, planningDone, happyCustomers } = req.body;

        // Build update object with only provided fields
        const updateData = {};
        if (yearExp !== undefined) updateData.yearExp = yearExp;
        if (totalExpert !== undefined) updateData.totalExpert = totalExpert;
        if (planningDone !== undefined) updateData.planningDone = planningDone;
        if (happyCustomers !== undefined) updateData.happyCustomers = happyCustomers;

        // Check if at least one field is provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "At least one field (yearExp, totalExpert, planningDone, happyCustomers) is required for update"
            });
        }

        // Type validation for provided fields
        for (const [key, value] of Object.entries(updateData)) {
            if (typeof value !== 'number') {
                return res.status(400).json({
                    status: "error",
                    message: `Field '${key}' must be a number`
                });
            }
        }

        // Find and update the existing record (assuming singleton pattern)
        const updatedTrack = await OurTrack.findOneAndUpdate(
            {}, // Find any record (singleton)
            updateData,
            {
                new: true,
                runValidators: true,
                upsert: true // Create if doesn't exist
            }
        );

        res.status(200).json({
            status: "success",
            message: "OurTrack data updated successfully",
            data: updatedTrack
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            status: "error",
            message: "Failed to update OurTrack data",
            error: error.message
        });
    }
};

const deleteOurTrack = async (req, res) => {
    try {
        // Delete the singleton record
        const deletedTrack = await OurTrack.findOneAndDelete({});

        if (!deletedTrack) {
            return res.status(404).json({
                status: "error",
                message: "No OurTrack data found to delete"
            });
        }

        res.status(200).json({
            status: "success",
            message: "OurTrack data deleted successfully",
            data: deletedTrack
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to delete OurTrack data",
            error: error.message
        });
    }
};

export {
    postOurTrack,
    getOurTrack,
    updateOurTrack,
    deleteOurTrack
};