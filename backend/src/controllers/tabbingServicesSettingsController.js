import TabbingServicesSettings from '../models/tabbingServicesSettings.js';
import fs from 'fs';
import path from 'path';

class TabbingServicesSettingsController {
    // Get tabbing services settings
    async getSettings(req, res) {
        try {
            let settings = await TabbingServicesSettings.findOne();

            // If no settings exist, create default ones
            if (!settings) {
                settings = new TabbingServicesSettings({
                    commonBackgroundImage: {
                        url: '/images/services/default-service.svg'
                    }
                });
                await settings.save();
            }

            res.status(200).json({
                success: true,
                data: settings
            });
        } catch (error) {
            console.error('Error fetching tabbing services settings:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch settings',
                error: error.message
            });
        }
    }

    // Update common background image
    async updateCommonBackgroundImage(req, res) {
        try {
            let settings = await TabbingServicesSettings.findOne();

            // If no settings exist, create new ones
            if (!settings) {
                settings = new TabbingServicesSettings();
            }

            console.log('📍 updateCommonBackgroundImage - Request body:', req.body);
            console.log('📍 updateCommonBackgroundImage - Request file:', req.file);

            // Handle file upload
            if (req.file) {
                // Delete old image file if it exists and is not the default
                if (settings.commonBackgroundImage?.path &&
                    !settings.commonBackgroundImage.path.includes('default-service.svg')) {
                    try {
                        fs.unlinkSync(settings.commonBackgroundImage.path);
                    } catch (err) {
                        console.warn('Could not delete old image:', err.message);
                    }
                }

                // Update with new image
                settings.commonBackgroundImage = {
                    url: `/uploads/images/${req.file.filename}`,
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                };
            } else if (req.body['commonBackgroundImage[url]']) {
                // Handle image URL from form data
                settings.commonBackgroundImage = {
                    url: req.body['commonBackgroundImage[url]'],
                    originalName: '',
                    filename: '',
                    path: '',
                    size: 0,
                    mimetype: ''
                };
                console.log('📍 Updated with URL:', settings.commonBackgroundImage.url);
            }

            await settings.save();

            res.status(200).json({
                success: true,
                message: 'Common background image updated successfully',
                data: settings
            });
        } catch (error) {
            console.error('Error updating common background image:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update common background image',
                error: error.message
            });
        }
    }

    // Reset common background image to default
    async resetCommonBackgroundImage(req, res) {
        try {
            let settings = await TabbingServicesSettings.findOne();

            if (!settings) {
                settings = new TabbingServicesSettings();
            }

            // Delete current image file if it exists and is not the default
            if (settings.commonBackgroundImage?.path &&
                !settings.commonBackgroundImage.path.includes('default-service.svg')) {
                try {
                    fs.unlinkSync(settings.commonBackgroundImage.path);
                } catch (err) {
                    console.warn('Could not delete image:', err.message);
                }
            }

            // Reset to default
            settings.commonBackgroundImage = {
                url: '/images/services/default-service.svg'
            };

            await settings.save();

            res.status(200).json({
                success: true,
                message: 'Common background image reset to default',
                data: settings
            });
        } catch (error) {
            console.error('Error resetting common background image:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to reset common background image',
                error: error.message
            });
        }
    }

    // Update common section settings (description and button)
    async updateCommonSettings(req, res) {
        try {
            const { description, buttonText, buttonLink } = req.body;

            let settings = await TabbingServicesSettings.findOne();

            // If no settings exist, create new ones
            if (!settings) {
                settings = new TabbingServicesSettings();
            }

            // Update fields if provided
            if (description !== undefined) {
                settings.commonImageDescription = description.trim();
            }
            if (buttonText !== undefined) {
                settings.commonImageButton.text = buttonText.trim();
            }
            if (buttonLink !== undefined) {
                settings.commonImageButton.link = buttonLink.trim();
            }

            await settings.save();

            res.status(200).json({
                success: true,
                message: 'Common section settings updated successfully',
                data: settings
            });
        } catch (error) {
            console.error('Error updating common section settings:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update common section settings',
                error: error.message
            });
        }
    }
}

export default new TabbingServicesSettingsController();
