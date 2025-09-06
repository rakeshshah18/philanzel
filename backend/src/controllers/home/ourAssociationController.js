import OurAssociation from '../../models/home/ourAssociation.js';
import fs from 'fs';
import path from 'path';

class OurAssociationController {
    // Get all our association entries
    async getAll(req, res) {
        try {
            const ourAssociation = await OurAssociation.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: ourAssociation
            });
        } catch (error) {
            console.error('Error fetching our association:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch our association entries',
                error: error.message
            });
        }
    }

    // Get single our association entry by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const ourAssociation = await OurAssociation.findById(id);

            if (!ourAssociation) {
                return res.status(404).json({
                    success: false,
                    message: 'Our association entry not found'
                });
            }

            res.status(200).json({
                success: true,
                data: ourAssociation
            });
        } catch (error) {
            console.error('Error fetching our association entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch our association entry',
                error: error.message
            });
        }
    }

    // Create new our association entry
    async create(req, res) {
        try {
            console.log('📍 Request body:', req.body);
            console.log('📍 Request files:', req.files);

            const { heading, description, button, rowOneData, rowTwoData, rowThreeData } = req.body;

            // Validate required fields
            if (!heading || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Heading and description are required'
                });
            }

            // Parse button if it's a string
            let parsedButton = { text: 'Learn More', link: '#' };
            if (button) {
                try {
                    parsedButton = typeof button === 'string' ? JSON.parse(button) : button;
                } catch (error) {
                    console.error('Error parsing button:', error);
                }
            }

            // Process uploaded images and organize by rows
            const processRowImages = (rowData, files, rowPrefix) => {
                let rowImages = [];

                if (rowData) {
                    try {
                        const parsedRowData = typeof rowData === 'string' ? JSON.parse(rowData) : rowData;
                        rowImages = parsedRowData || [];
                    } catch (error) {
                        console.error(`Error parsing ${rowPrefix} data:`, error);
                    }
                }

                // Add file information to corresponding images
                if (files && files.length > 0) {
                    files.forEach((file) => {
                        if (file.fieldname.startsWith(rowPrefix)) {
                            const index = parseInt(file.fieldname.replace(rowPrefix, '')) || 0;
                            if (rowImages[index]) {
                                rowImages[index] = {
                                    ...rowImages[index],
                                    url: `/uploads/images/${file.filename}`,
                                    originalName: file.originalname,
                                    filename: file.filename
                                };
                            } else {
                                rowImages.push({
                                    url: `/uploads/images/${file.filename}`,
                                    originalName: file.originalname,
                                    filename: file.filename,
                                    alt: ''
                                });
                            }
                        }
                    });
                }

                return rowImages;
            };

            const rowOne = processRowImages(rowOneData, req.files, 'rowOne_');
            const rowTwo = processRowImages(rowTwoData, req.files, 'rowTwo_');
            const rowThree = processRowImages(rowThreeData, req.files, 'rowThree_');

            const ourAssociationData = {
                heading,
                description,
                button: parsedButton,
                rowOne,
                rowTwo,
                rowThree
            };

            const ourAssociation = new OurAssociation(ourAssociationData);
            await ourAssociation.save();

            console.log('📍 Our association entry created successfully:', ourAssociation._id);

            res.status(201).json({
                success: true,
                message: 'Our association entry created successfully',
                data: ourAssociation
            });
        } catch (error) {
            console.error('Error creating our association entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create our association entry',
                error: error.message
            });
        }
    }

    // Update our association entry
    async update(req, res) {
        try {
            const { id } = req.params;
            const { heading, description, button, rowOneData, rowTwoData, rowThreeData } = req.body;

            const existingEntry = await OurAssociation.findById(id);
            if (!existingEntry) {
                return res.status(404).json({
                    success: false,
                    message: 'Our association entry not found'
                });
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

            // Process images for each row
            const processRowImages = (rowData, files, rowPrefix, existingImages) => {
                let rowImages = existingImages || [];

                if (rowData) {
                    try {
                        const parsedRowData = typeof rowData === 'string' ? JSON.parse(rowData) : rowData;
                        rowImages = parsedRowData || [];
                    } catch (error) {
                        console.error(`Error parsing ${rowPrefix} data:`, error);
                    }
                }

                // Add file information to corresponding images
                if (files && files.length > 0) {
                    files.forEach((file) => {
                        if (file.fieldname.startsWith(rowPrefix)) {
                            const index = parseInt(file.fieldname.replace(rowPrefix, '')) || 0;

                            // Delete old image if exists
                            if (rowImages[index] && rowImages[index].filename) {
                                const oldImagePath = path.join(process.cwd(), 'src', 'uploads', 'images', rowImages[index].filename);
                                if (fs.existsSync(oldImagePath)) {
                                    fs.unlinkSync(oldImagePath);
                                }
                            }

                            if (rowImages[index]) {
                                rowImages[index] = {
                                    ...rowImages[index],
                                    url: `/uploads/images/${file.filename}`,
                                    originalName: file.originalname,
                                    filename: file.filename
                                };
                            } else {
                                rowImages.push({
                                    url: `/uploads/images/${file.filename}`,
                                    originalName: file.originalname,
                                    filename: file.filename,
                                    alt: ''
                                });
                            }
                        }
                    });
                }

                return rowImages;
            };

            const rowOne = processRowImages(rowOneData, req.files, 'rowOne_', existingEntry.rowOne);
            const rowTwo = processRowImages(rowTwoData, req.files, 'rowTwo_', existingEntry.rowTwo);
            const rowThree = processRowImages(rowThreeData, req.files, 'rowThree_', existingEntry.rowThree);

            const updateData = {
                heading: heading || existingEntry.heading,
                description: description || existingEntry.description,
                button: parsedButton,
                rowOne,
                rowTwo,
                rowThree
            };

            const updatedEntry = await OurAssociation.findByIdAndUpdate(id, updateData, { new: true });

            console.log('📍 Our association entry updated successfully:', id);

            res.status(200).json({
                success: true,
                message: 'Our association entry updated successfully',
                data: updatedEntry
            });
        } catch (error) {
            console.error('Error updating our association entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update our association entry',
                error: error.message
            });
        }
    }

    // Delete our association entry
    async delete(req, res) {
        try {
            const { id } = req.params;

            const existingEntry = await OurAssociation.findById(id);
            if (!existingEntry) {
                return res.status(404).json({
                    success: false,
                    message: 'Our association entry not found'
                });
            }

            // Delete all associated image files
            const deleteRowImages = (rowImages) => {
                if (rowImages && rowImages.length > 0) {
                    rowImages.forEach(image => {
                        if (image.filename && image.filename !== 'default-service.svg') {
                            const imagePath = path.join(process.cwd(), 'src', 'uploads', 'images', image.filename);
                            if (fs.existsSync(imagePath)) {
                                fs.unlinkSync(imagePath);
                            }
                        }
                    });
                }
            };

            deleteRowImages(existingEntry.rowOne);
            deleteRowImages(existingEntry.rowTwo);
            deleteRowImages(existingEntry.rowThree);

            await OurAssociation.findByIdAndDelete(id);

            console.log('📍 Our association entry deleted successfully:', id);

            res.status(200).json({
                success: true,
                message: 'Our association entry deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting our association entry:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete our association entry',
                error: error.message
            });
        }
    }
}

export default new OurAssociationController();
