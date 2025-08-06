import WhyChooseUs from '../../models/home/whyChooseUs.js';
import fs from 'fs';
import path from 'path';

class WhyChooseUsController {
    // Get all why choose us entries
    async getAll(req, res) {
        try {
            console.log('📍 GET /admin/why-choose-us - request received');
            const whyChooseUs = await WhyChooseUs.find().sort({ createdAt: -1 });
            console.log('📍 Found why choose us entries:', whyChooseUs.length);

            res.status(200).json({
                success: true,
                data: whyChooseUs
            });
        } catch (error) {
            console.error('Error fetching why choose us:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch why choose us entries',
                error: error.message
            });
        }
    }

    // Get single why choose us entry by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const whyChooseUs = await WhyChooseUs.findById(id);

            if (!whyChooseUs) {
                return res.status(404).json({
                    success: false,
                    message: 'Why choose us entry not found'
                });
            }

            res.status(200).json({
                success: true,
                data: whyChooseUs
            });
        } catch (error) {
            console.error('Error fetching why choose us entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch why choose us entry',
                error: error.message
            });
        }
    }

    // Create new why choose us entry
    async create(req, res) {
        try {
            console.log('📍 POST /admin/why-choose-us - request received');
            console.log('📍 Request body:', req.body);
            console.log('📍 Request file:', req.file);

            const { heading, description, points, button } = req.body;

            // Validate required fields
            if (!heading || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Heading and description are required'
                });
            }

            // Parse points if it's a string
            let parsedPoints = [];
            if (points) {
                try {
                    parsedPoints = typeof points === 'string' ? JSON.parse(points) : points;
                } catch (error) {
                    console.error('Error parsing points:', error);
                }
            }

            // Parse button if it's a string
            let parsedButton = { text: 'Get Started', link: '#' };
            if (button) {
                try {
                    parsedButton = typeof button === 'string' ? JSON.parse(button) : button;
                } catch (error) {
                    console.error('Error parsing button:', error);
                }
            }

            // Handle image upload
            let imageData = {
                url: '/images/services/default-service.svg',
                originalName: '',
                filename: ''
            };

            if (req.file) {
                imageData = {
                    url: `/uploads/images/${req.file.filename}`,
                    originalName: req.file.originalname,
                    filename: req.file.filename
                };
            }

            const whyChooseUsData = {
                image: imageData,
                heading,
                description,
                points: parsedPoints,
                button: parsedButton
            };

            const whyChooseUs = new WhyChooseUs(whyChooseUsData);
            await whyChooseUs.save();

            console.log('📍 Why choose us entry created successfully:', whyChooseUs._id);

            res.status(201).json({
                success: true,
                message: 'Why choose us entry created successfully',
                data: whyChooseUs
            });
        } catch (error) {
            console.error('Error creating why choose us entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create why choose us entry',
                error: error.message
            });
        }
    }

    // Update why choose us entry
    async update(req, res) {
        try {
            console.log('📍 PUT /admin/why-choose-us/:id - request received');
            const { id } = req.params;
            const { heading, description, points, button } = req.body;

            const existingEntry = await WhyChooseUs.findById(id);
            if (!existingEntry) {
                return res.status(404).json({
                    success: false,
                    message: 'Why choose us entry not found'
                });
            }

            // Parse points if it's a string
            let parsedPoints = existingEntry.points;
            if (points) {
                try {
                    parsedPoints = typeof points === 'string' ? JSON.parse(points) : points;
                } catch (error) {
                    console.error('Error parsing points:', error);
                }
            }

            // Parse button if it's a string
            let parsedButton = existingEntry.button;
            if (button) {
                try {
                    parsedButton = typeof button === 'string' ? JSON.parse(button) : button;
                } catch (error) {
                    console.error('Error parsing button:', error);
                }
            }

            // Handle image upload
            let imageData = existingEntry.image;
            if (req.file) {
                // Delete old image if it's not the default
                if (existingEntry.image.filename && existingEntry.image.filename !== 'default-service.svg') {
                    const oldImagePath = path.join(process.cwd(), 'src', 'uploads', 'images', existingEntry.image.filename);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                imageData = {
                    url: `/uploads/images/${req.file.filename}`,
                    originalName: req.file.originalname,
                    filename: req.file.filename
                };
            }

            const updateData = {
                image: imageData,
                heading: heading || existingEntry.heading,
                description: description || existingEntry.description,
                points: parsedPoints,
                button: parsedButton
            };

            const updatedEntry = await WhyChooseUs.findByIdAndUpdate(id, updateData, { new: true });

            console.log('📍 Why choose us entry updated successfully:', id);

            res.status(200).json({
                success: true,
                message: 'Why choose us entry updated successfully',
                data: updatedEntry
            });
        } catch (error) {
            console.error('Error updating why choose us entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update why choose us entry',
                error: error.message
            });
        }
    }

    // Delete why choose us entry
    async delete(req, res) {
        try {
            console.log('📍 DELETE /admin/why-choose-us/:id - request received');
            const { id } = req.params;

            const existingEntry = await WhyChooseUs.findById(id);
            if (!existingEntry) {
                return res.status(404).json({
                    success: false,
                    message: 'Why choose us entry not found'
                });
            }

            // Delete image file if it's not the default
            if (existingEntry.image.filename && existingEntry.image.filename !== 'default-service.svg') {
                const imagePath = path.join(process.cwd(), 'src', 'uploads', 'images', existingEntry.image.filename);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await WhyChooseUs.findByIdAndDelete(id);

            console.log('📍 Why choose us entry deleted successfully:', id);

            res.status(200).json({
                success: true,
                message: 'Why choose us entry deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting why choose us entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete why choose us entry',
                error: error.message
            });
        }
    }
}

export default new WhyChooseUsController();
