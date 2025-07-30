import HelpedIndustries from '../models/helpedIndustries.js';

class HelpedIndustriesController {
    // Get all helped industries
    async getAll(req, res) {
        try {
            console.log('📍 GET /admin/helped-industries - request received');
            const helpedIndustries = await HelpedIndustries.find().sort({ createdAt: -1 });
            console.log('📍 Found helped industries:', helpedIndustries.length);

            res.status(200).json({
                success: true,
                data: helpedIndustries
            });
        } catch (error) {
            console.error('Error fetching helped industries:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch helped industries',
                error: error.message
            });
        }
    }

    // Get single helped industries by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const helpedIndustries = await HelpedIndustries.findById(id);

            if (!helpedIndustries) {
                return res.status(404).json({
                    success: false,
                    message: 'Helped industries not found'
                });
            }

            res.status(200).json({
                success: true,
                data: helpedIndustries
            });
        } catch (error) {
            console.error('Error fetching helped industries:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch helped industries',
                error: error.message
            });
        }
    }

    // Create new helped industries
    async create(req, res) {
        try {
            console.log('📍 POST /admin/helped-industries - request received');
            console.log('📍 Request body:', req.body);

            const { heading, description, industries } = req.body;

            // Validate required fields
            if (!heading || !description || !industries || !Array.isArray(industries)) {
                console.log('❌ Validation failed - missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Heading, description, and industries array are required'
                });
            }

            // Validate industries array
            for (let i = 0; i < industries.length; i++) {
                const industry = industries[i];
                if (!industry.name || !industry.icon) {
                    return res.status(400).json({
                        success: false,
                        message: `Industry at index ${i} must have name and icon`
                    });
                }
            }

            const helpedIndustries = new HelpedIndustries({
                heading,
                description,
                industries
            });

            await helpedIndustries.save();

            res.status(201).json({
                success: true,
                message: 'Helped industries created successfully',
                data: helpedIndustries
            });
        } catch (error) {
            console.error('Error creating helped industries:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create helped industries',
                error: error.message
            });
        }
    }

    // Update helped industries
    async update(req, res) {
        try {
            const { id } = req.params;
            const { heading, description, industries } = req.body;

            // Check if helped industries exists
            const existingHelpedIndustries = await HelpedIndustries.findById(id);
            if (!existingHelpedIndustries) {
                return res.status(404).json({
                    success: false,
                    message: 'Helped industries not found'
                });
            }

            // Validate industries array if provided
            if (industries && Array.isArray(industries)) {
                for (let i = 0; i < industries.length; i++) {
                    const industry = industries[i];
                    if (!industry.name || !industry.icon) {
                        return res.status(400).json({
                            success: false,
                            message: `Industry at index ${i} must have name and icon`
                        });
                    }
                }
            }

            // Update fields
            const updateData = {};
            if (heading !== undefined) updateData.heading = heading;
            if (description !== undefined) updateData.description = description;
            if (industries !== undefined) updateData.industries = industries;

            const updatedHelpedIndustries = await HelpedIndustries.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Helped industries updated successfully',
                data: updatedHelpedIndustries
            });
        } catch (error) {
            console.error('Error updating helped industries:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update helped industries',
                error: error.message
            });
        }
    }

    // Delete helped industries
    async delete(req, res) {
        try {
            const { id } = req.params;

            const deletedHelpedIndustries = await HelpedIndustries.findByIdAndDelete(id);

            if (!deletedHelpedIndustries) {
                return res.status(404).json({
                    success: false,
                    message: 'Helped industries not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Helped industries deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting helped industries:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete helped industries',
                error: error.message
            });
        }
    }
}

export default new HelpedIndustriesController();
