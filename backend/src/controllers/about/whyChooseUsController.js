import AboutWhyChooseUs from '../../models/about/whyChooseUs.js';
import fs from 'fs';
import path from 'path';

// Create new why choose us content
export const createWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 POST /why-choose-us - Creating new content');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const { heading, title, button, points } = req.body;

        // Validate required fields
        if (!heading?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        // Parse button data if it's a string
        let buttonData;
        try {
            buttonData = typeof button === 'string' ? JSON.parse(button) : button;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid button data format'
            });
        }

        if (!buttonData?.text?.trim() || !buttonData?.link?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Button text and link are required'
            });
        }

        // Parse points data if it's a string
        let pointsData = [];
        if (points) {
            try {
                pointsData = typeof points === 'string' ? JSON.parse(points) : points;
                if (!Array.isArray(pointsData)) {
                    pointsData = [];
                }
            } catch (error) {
                console.log('Points parsing error:', error);
                pointsData = [];
            }
        }

        // Handle image upload or URL
        let imageData = {};
        if (req.file) {
            imageData = {
                url: `/uploads/images/${req.file.filename}`,
                altText: 'Why Choose Us Image'
            };
            console.log('Image uploaded:', req.file.filename);
        } else if (req.body['image[url]']) {
            // Handle image URL from FormData bracket notation
            imageData = {
                url: req.body['image[url]'],
                altText: 'Why Choose Us Image'
            };
            console.log('Image URL provided:', req.body['image[url]']);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Image is required (file upload or URL)'
            });
        }

        // Create new why choose us entry
        const whyChooseUsData = {
            image: imageData,
            heading: heading.trim(),
            title: title.trim(),
            button: {
                text: buttonData.text.trim(),
                link: buttonData.link.trim()
            },
            points: pointsData.map((point, index) => ({
                icon: point.icon || 'fas fa-star',
                title: point.title || '',
                description: point.description || '',
                order: point.order !== undefined ? point.order : index
            }))
        };

        const newWhyChooseUs = new AboutWhyChooseUs(whyChooseUsData);
        const savedWhyChooseUs = await newWhyChooseUs.save();

        console.log('✅ Why Choose Us content created successfully');

        res.status(201).json({
            success: true,
            message: 'Why Choose Us content created successfully',
            data: savedWhyChooseUs
        });

    } catch (error) {
        console.error('Error creating why choose us content:', error);

        // Clean up uploaded file if creation fails
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all why choose us content
export const getAllWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 GET /why-choose-us - Fetching all content');

        const { page = 1, limit = 10, active } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build query conditions
        const conditions = {};
        if (active !== undefined) {
            conditions.isActive = active === 'true';
        }

        // Get content with ordered points
        const whyChooseUsContent = await AboutWhyChooseUs.getWithOrderedPoints(conditions)
            .skip(skip)
            .limit(limitNum);

        const totalItems = await AboutWhyChooseUs.countDocuments(conditions);
        const totalPages = Math.ceil(totalItems / limitNum);

        console.log(`📍 Found ${whyChooseUsContent.length} why choose us entries`);

        res.status(200).json({
            status: 'success',
            message: 'Why Choose Us content retrieved successfully',
            data: whyChooseUsContent,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            }
        });

    } catch (error) {
        console.error('Error fetching why choose us content:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get why choose us content by ID
export const getWhyChooseUsById = async (req, res) => {
    try {
        console.log('📍 GET /why-choose-us/:id - Fetching content by ID');
        const { id } = req.params;

        const whyChooseUs = await AboutWhyChooseUs.findById(id);

        if (!whyChooseUs) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose Us content not found'
            });
        }

        // Sort points by order
        whyChooseUs.points.sort((a, b) => (a.order || 0) - (b.order || 0));

        res.status(200).json({
            success: true,
            message: 'Why Choose Us content retrieved successfully',
            data: whyChooseUs
        });

    } catch (error) {
        console.error('Error fetching why choose us content by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update why choose us content
export const updateWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 PUT /why-choose-us/:id - Updating content');
        const { id } = req.params;
        const { heading, title, button, points } = req.body;

        const whyChooseUs = await AboutWhyChooseUs.findById(id);
        if (!whyChooseUs) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose Us content not found'
            });
        }

        // Update basic fields
        if (heading?.trim()) whyChooseUs.heading = heading.trim();
        if (title?.trim()) whyChooseUs.title = title.trim();

        // Update button data
        if (button) {
            let buttonData;
            try {
                buttonData = typeof button === 'string' ? JSON.parse(button) : button;
                if (buttonData.text?.trim()) whyChooseUs.button.text = buttonData.text.trim();
                if (buttonData.link?.trim()) whyChooseUs.button.link = buttonData.link.trim();
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid button data format'
                });
            }
        }

        // Update points
        if (points) {
            try {
                let pointsData = typeof points === 'string' ? JSON.parse(points) : points;
                if (Array.isArray(pointsData)) {
                    whyChooseUs.points = pointsData.map((point, index) => ({
                        icon: point.icon || 'fas fa-star',
                        title: point.title || '',
                        description: point.description || '',
                        order: point.order !== undefined ? point.order : index
                    }));
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid points data format'
                });
            }
        }

        // Handle new image upload or URL
        if (req.file) {
            // Delete old image if it exists
            if (whyChooseUs.image?.url && !whyChooseUs.image.url.startsWith('http')) {
                const oldImagePath = path.join(process.cwd(), 'uploads', 'images', path.basename(whyChooseUs.image.url));
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (error) {
                    console.error('Error deleting old image:', error);
                }
            }

            whyChooseUs.image = {
                url: `/uploads/images/${req.file.filename}`,
                altText: whyChooseUs.heading || 'Why Choose Us Image'
            };
            console.log('New image uploaded:', req.file.filename);
        } else if (req.body['image[url]']) {
            // Handle image URL from FormData bracket notation
            whyChooseUs.image = {
                url: req.body['image[url]'],
                altText: whyChooseUs.heading || 'Why Choose Us Image'
            };
            console.log('Image URL updated:', req.body['image[url]']);
        }

        const updatedWhyChooseUs = await whyChooseUs.save();

        console.log('✅ Why Choose Us content updated successfully');

        res.status(200).json({
            success: true,
            message: 'Why Choose Us content updated successfully',
            data: updatedWhyChooseUs
        });

    } catch (error) {
        console.error('Error updating why choose us content:', error);

        // Clean up uploaded file if update fails
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting uploaded file:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete why choose us content
export const deleteWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 DELETE /why-choose-us/:id - Deleting content');
        const { id } = req.params;

        const whyChooseUs = await AboutWhyChooseUs.findById(id);
        if (!whyChooseUs) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose Us content not found'
            });
        }

        // Delete associated image file
        if (whyChooseUs.image?.url && !whyChooseUs.image.url.startsWith('http')) {
            const imagePath = path.join(process.cwd(), 'uploads', 'images', path.basename(whyChooseUs.image.url));
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Associated image deleted:', path.basename(whyChooseUs.image.url));
                }
            } catch (error) {
                console.error('Error deleting associated image:', error);
            }
        }

        await AboutWhyChooseUs.findByIdAndDelete(id);

        console.log('✅ Why Choose Us content deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Why Choose Us content deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting why choose us content:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add a point to existing why choose us content
export const addPointToWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 POST /why-choose-us/:id/points - Adding point');
        const { id } = req.params;
        const { icon, title, description, order } = req.body;

        if (!icon?.trim() || !title?.trim() || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Icon, title, and description are required for points'
            });
        }

        const whyChooseUs = await AboutWhyChooseUs.findById(id);
        if (!whyChooseUs) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose Us content not found'
            });
        }

        const pointData = {
            icon: icon.trim(),
            title: title.trim(),
            description: description.trim(),
            order: order !== undefined ? parseInt(order) : whyChooseUs.points.length
        };

        await whyChooseUs.addPoint(pointData);

        console.log('✅ Point added successfully');

        res.status(200).json({
            success: true,
            message: 'Point added successfully',
            data: whyChooseUs
        });

    } catch (error) {
        console.error('Error adding point:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Remove a point from why choose us content
export const removePointFromWhyChooseUs = async (req, res) => {
    try {
        console.log('📍 DELETE /why-choose-us/:id/points/:pointId - Removing point');
        const { id, pointId } = req.params;

        const whyChooseUs = await AboutWhyChooseUs.findById(id);
        if (!whyChooseUs) {
            return res.status(404).json({
                success: false,
                message: 'Why Choose Us content not found'
            });
        }

        await whyChooseUs.removePoint(pointId);

        console.log('✅ Point removed successfully');

        res.status(200).json({
            success: true,
            message: 'Point removed successfully',
            data: whyChooseUs
        });

    } catch (error) {
        console.error('Error removing point:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
