import OurFounder from '../../models/about/ourFounder.js';
import fs from 'fs';
import path from 'path';

class OurFounderController {
    // Get all founders
    async getAll(req, res) {
        try {
            const founders = await OurFounder.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: founders
            });
        } catch (error) {
            console.error('Error fetching our founder:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch our founder entries',
                error: error.message
            });
        }
    }

    // Get single founder by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const founder = await OurFounder.findById(id);

            if (!founder) {
                return res.status(404).json({
                    success: false,
                    message: 'Our founder entry not found'
                });
            }

            res.status(200).json({
                success: true,
                data: founder
            });
        } catch (error) {
            console.error('Error fetching our founder entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch our founder entry',
                error: error.message
            });
        }
    }

    // Create new founder
    async create(req, res) {
        try {
            console.log('📍 POST /admin/about/our-founder - request received');
            const { name, designation, description } = req.body;

            // Handle image upload or URL
            let imageData = {
                url: '/images/defaults/default-founder.svg',
                altText: name || 'Our Founder'
            };

            if (req.file) {
                imageData = {
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    url: `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`,
                    altText: name || 'Our Founder'
                };
            } else if (req.body['image[url]']) {
                // Handle image URL from FormData bracket notation
                imageData = {
                    url: req.body['image[url]'],
                    altText: name || 'Our Founder'
                };
                console.log('Image URL provided:', req.body['image[url]']);
            }

            const newFounder = new OurFounder({
                image: imageData,
                name,
                designation,
                description
            });

            const savedFounder = await newFounder.save();

            console.log('📍 Our founder entry created successfully:', savedFounder._id);

            res.status(201).json({
                success: true,
                message: 'Our founder entry created successfully',
                data: savedFounder
            });
        } catch (error) {
            console.error('Error creating our founder entry:', error);

            // Delete uploaded file if there was an error
            if (req.file) {
                const filePath = path.join(process.cwd(), 'src', 'uploads', 'images', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            res.status(500).json({
                success: false,
                message: 'Failed to create our founder entry',
                error: error.message
            });
        }
    }

    // Update founder
    async update(req, res) {
        try {
            console.log('📍 PUT /admin/about/our-founder/:id - request received');
            console.log('📍 Request body:', req.body);
            console.log('📍 Request file:', req.file);
            console.log('📍 image[url]:', req.body['image[url]']);
            const { id } = req.params;
            const { name, designation, description } = req.body;

            const existingFounder = await OurFounder.findById(id);
            if (!existingFounder) {
                return res.status(404).json({
                    success: false,
                    message: 'Our founder entry not found'
                });
            }

            // Handle image upload or URL
            // Convert existing image to plain object to avoid Mongoose subdocument issues
            let imageData = existingFounder.image ? existingFounder.image.toObject ? existingFounder.image.toObject() : { ...existingFounder.image } : {};

            if (req.file) {
                // Delete old image if it exists and is not default
                if (existingFounder.image && existingFounder.image.url && !existingFounder.image.url.includes('default-founder.svg')) {
                    const oldImagePath = existingFounder.image.url.replace(`${req.protocol}://${req.get('host')}/uploads/images/`, '');
                    const fullOldPath = path.join(process.cwd(), 'src', 'uploads', 'images', oldImagePath);
                    if (fs.existsSync(fullOldPath)) {
                        fs.unlinkSync(fullOldPath);
                    }
                }

                imageData = {
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    url: `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`,
                    altText: name || existingFounder.name
                };
            } else if (req.body['image[url]']) {
                // Handle image URL from FormData bracket notation
                console.log('📍 Updating with image URL:', req.body['image[url]']);
                imageData = {
                    url: req.body['image[url]'],
                    altText: name || existingFounder.name
                };
            } else if (name && name !== existingFounder.name) {
                // Update alt text if name changed
                imageData = {
                    ...imageData,
                    altText: name
                };
            }

            const updateData = {
                image: imageData,
                name: name || existingFounder.name,
                designation: designation || existingFounder.designation,
                description: description || existingFounder.description
            };

            console.log('📍 Update data being sent:', JSON.stringify(updateData, null, 2));

            const updatedFounder = await OurFounder.findByIdAndUpdate(id, updateData, { new: true });

            console.log('📍 Our founder entry updated successfully:', id);
            console.log('📍 Updated founder image:', updatedFounder.image);

            res.status(200).json({
                success: true,
                message: 'Our founder entry updated successfully',
                data: updatedFounder
            });
        } catch (error) {
            console.error('Error updating our founder entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update our founder entry',
                error: error.message
            });
        }
    }

    // Delete founder
    async delete(req, res) {
        try {
            console.log('📍 DELETE /admin/about/our-founder/:id - request received');
            const { id } = req.params;

            const existingFounder = await OurFounder.findById(id);
            if (!existingFounder) {
                return res.status(404).json({
                    success: false,
                    message: 'Our founder entry not found'
                });
            }

            // Delete associated image file if it exists and is not default
            if (existingFounder.image && existingFounder.image.url && !existingFounder.image.url.includes('default-founder.svg')) {
                const imagePath = existingFounder.image.url.replace(`${req.protocol}://${req.get('host')}/uploads/images/`, '');
                const fullImagePath = path.join(process.cwd(), 'src', 'uploads', 'images', imagePath);
                if (fs.existsSync(fullImagePath)) {
                    fs.unlinkSync(fullImagePath);
                }
            }

            await OurFounder.findByIdAndDelete(id);

            console.log('📍 Our founder entry deleted successfully:', id);

            res.status(200).json({
                success: true,
                message: 'Our founder entry deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting our founder entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete our founder entry',
                error: error.message
            });
        }
    }
}

export default new OurFounderController();
