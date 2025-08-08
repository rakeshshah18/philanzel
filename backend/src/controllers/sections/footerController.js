import Footer from '../../models/sections/footer.js';
import mongoose from 'mongoose';

// Helper function to get or create footer
const getOrCreateFooter = async () => {
    let footer = await Footer.findOne({ isActive: true });

    if (!footer) {
        // Create a default footer if none exists
        footer = new Footer({
            aboutUs: {
                description: 'Welcome to our company. We are dedicated to providing excellent services.',
                readMoreButton: {
                    text: 'Read More',
                    url: '/about',
                    isEnabled: true
                }
            },
            quickLinks: {
                title: 'Quick Links',
                links: []
            },
            ourServices: {
                title: 'Our Services',
                services: []
            },
            calculators: {
                title: 'Calculators',
                calculatorList: []
            },
            optimizeStrategy: {
                title: 'Optimize Strategy',
                strategies: [],
                displayLimit: 3,
                showInFooter: true
            },
            contactUs: {
                title: 'Contact Us',
                address: {
                    street: '123 Business Street',
                    city: 'Business City',
                    state: 'Business State',
                    zipCode: '12345',
                    country: 'Country'
                },
                phoneNumber: {
                    primary: '+1234567890'
                },
                email: {
                    primary: 'info@company.com'
                },
                followUs: {
                    title: 'Follow Us',
                    socialLinks: []
                }
            },
            copyrightText: 'Copyright © {year} Your Company. All rights reserved.',
            privacyPolicy: {
                title: 'Privacy Policy',
                description: 'Default privacy policy content will be updated soon.'
            },
            termsOfService: {
                title: 'Terms of Service',
                description: 'Default terms of service content will be updated soon.'
            },
            legalDisclaimer: {
                title: 'Legal Disclaimer',
                description: 'Default legal disclaimer content will be updated soon.'
            }
        });
        await footer.save();
    }

    return footer;
};

// ===== GENERAL FOOTER OPERATIONS =====

// Get footer data
const getFooter = async (req, res) => {
    try {
        console.log('📊 Fetching footer data...');

        const footer = await getOrCreateFooter();

        console.log('✅ Footer data retrieved successfully');

        res.status(200).json({
            success: true,
            message: 'Footer data retrieved successfully',
            data: footer
        });
    } catch (error) {
        console.error('❌ Error fetching footer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch footer data',
            error: error.message
        });
    }
};

// Update footer data
const updateFooter = async (req, res) => {
    try {
        console.log('📝 Updating footer data...');
        console.log('Update data:', req.body);

        const footer = await getOrCreateFooter();

        // Update footer with provided data
        Object.assign(footer, req.body);
        await footer.save();

        console.log('✅ Footer updated successfully');

        res.status(200).json({
            success: true,
            message: 'Footer updated successfully',
            data: footer
        });
    } catch (error) {
        console.error('❌ Error updating footer:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update footer',
            error: error.message
        });
    }
};

// ===== OPTIMIZE STRATEGY OPERATIONS =====

// Get all optimize strategies
const getAllOptimizeStrategies = async (req, res) => {
    try {
        console.log('📊 Fetching all optimize strategies...');

        const footer = await getOrCreateFooter();
        const strategies = footer.getAllOptimizeStrategies();

        console.log(`✅ Found ${strategies.length} strategies`);

        res.status(200).json({
            success: true,
            message: 'Strategies retrieved successfully',
            data: strategies,
            count: strategies.length
        });
    } catch (error) {
        console.error('❌ Error fetching strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategies',
            error: error.message
        });
    }
};

// Get paginated optimize strategies
const getPaginatedOptimizeStrategies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log(`📊 Fetching paginated strategies - Page: ${page}, Limit: ${limit}`);

        const footer = await getOrCreateFooter();
        const allStrategies = footer.getAllOptimizeStrategies();

        const strategies = allStrategies.slice(skip, skip + limit);
        const total = allStrategies.length;
        const totalPages = Math.ceil(total / limit);

        console.log(`✅ Found ${strategies.length} strategies (Page ${page}/${totalPages})`);

        res.status(200).json({
            success: true,
            message: 'Strategies retrieved successfully',
            data: strategies,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('❌ Error fetching paginated strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategies',
            error: error.message
        });
    }
};

// Search optimize strategies
const searchOptimizeStrategies = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        console.log(`🔍 Searching strategies with query: "${query}"`);

        const footer = await getOrCreateFooter();
        const strategies = footer.searchOptimizeStrategies(query);

        console.log(`✅ Found ${strategies.length} strategies matching "${query}"`);

        res.status(200).json({
            success: true,
            message: `Search results for "${query}"`,
            data: strategies,
            count: strategies.length,
            query
        });
    } catch (error) {
        console.error('❌ Error searching strategies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search strategies',
            error: error.message
        });
    }
};

// Get optimize strategy by index
const getOptimizeStrategyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Valid strategy index is required'
            });
        }

        console.log(`🔍 Fetching strategy at index: ${id}`);

        const footer = await getOrCreateFooter();
        const strategies = footer.getAllOptimizeStrategies();
        const strategyIndex = parseInt(id);

        if (strategyIndex < 0 || strategyIndex >= strategies.length) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        const strategy = strategies[strategyIndex];

        console.log(`✅ Strategy found: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy retrieved successfully',
            data: strategy,
            index: strategyIndex
        });
    } catch (error) {
        console.error('❌ Error fetching strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strategy',
            error: error.message
        });
    }
};

// Create new optimize strategy
const createOptimizeStrategy = async (req, res) => {
    try {
        console.log('📝 Creating new optimize strategy...');
        console.log('Request body:', req.body);

        const {
            heading,
            description,
            isActive = false,
            isVisible = true,
            order = 0
        } = req.body;

        // Validation
        if (!heading || !heading.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Heading is required'
            });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        const footer = await getOrCreateFooter();

        // If this strategy should be active, deactivate all others
        if (isActive) {
            footer.optimizeStrategy.strategies.forEach(strategy => {
                strategy.isActive = false;
            });
        }

        // Create new strategy object
        const newStrategy = {
            heading: heading.trim(),
            description: description.trim(),
            isActive,
            isVisible,
            order,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Add to footer strategies array
        footer.optimizeStrategy.strategies.push(newStrategy);

        // Save footer
        await footer.save();

        const strategyIndex = footer.optimizeStrategy.strategies.length - 1;

        console.log(`✅ Strategy created successfully: ${heading}`);

        res.status(201).json({
            success: true,
            message: 'Strategy created successfully',
            data: newStrategy,
            index: strategyIndex
        });
    } catch (error) {
        console.error('❌ Error creating strategy:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create strategy',
            error: error.message
        });
    }
};

// Update optimize strategy
const updateOptimizeStrategy = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Strategy ID is required'
            });
        }

        console.log(`📝 Updating strategy with ID: ${id}`);

        const footer = await getOrCreateFooter();
        const strategies = footer.optimizeStrategy.strategies;

        // Find strategy by _id
        const strategy = strategies.id(id);

        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        // If this strategy should be active, deactivate all others
        if (updateData.isActive) {
            strategies.forEach((s) => {
                if (s._id.toString() !== id) {
                    s.isActive = false;
                }
            });
        }

        // Update strategy
        Object.assign(strategy, updateData, { updatedAt: new Date() });

        await footer.save();

        console.log(`✅ Strategy updated successfully: ${strategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy updated successfully',
            data: strategy
        });
    } catch (error) {
        console.error('❌ Error updating strategy:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update strategy',
            error: error.message
        });
    }
};

// Delete optimize strategy
const deleteOptimizeStrategy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Strategy ID is required'
            });
        }

        console.log(`🗑️ Deleting strategy with ID: ${id}`);

        const footer = await getOrCreateFooter();
        const strategies = footer.optimizeStrategy.strategies;

        // Find strategy by _id
        const strategy = strategies.id(id);

        if (!strategy) {
            return res.status(404).json({
                success: false,
                message: 'Strategy not found'
            });
        }

        const deletedStrategyHeading = strategy.heading;

        // Remove the strategy using MongoDB's pull method
        strategies.pull(id);

        await footer.save();

        console.log(`✅ Strategy deleted successfully: ${deletedStrategyHeading}`);

        res.status(200).json({
            success: true,
            message: 'Strategy deleted successfully',
            data: { heading: deletedStrategyHeading }
        });
    } catch (error) {
        console.error('❌ Error deleting strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete strategy',
            error: error.message
        });
    }
};

// Get active optimize strategy for public display
const getActiveOptimizeStrategy = async (req, res) => {
    try {
        console.log('🎯 Fetching active strategy for public display...');

        const footer = await getOrCreateFooter();
        const activeStrategy = footer.getActiveOptimizeStrategy();

        if (!activeStrategy) {
            return res.status(404).json({
                success: false,
                message: 'No active strategy found'
            });
        }

        console.log(`✅ Active strategy found: ${activeStrategy.heading}`);

        res.status(200).json({
            success: true,
            message: 'Active strategy retrieved successfully',
            data: activeStrategy
        });
    } catch (error) {
        console.error('❌ Error fetching active strategy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active strategy',
            error: error.message
        });
    }
};

// ===== QUICK LINKS OPERATIONS =====

// Add quick link
const addQuickLink = async (req, res) => {
    try {
        console.log('📝 Adding new quick link...');

        const { title, url, isEnabled = true, openInNewTab = false, order = 0 } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: 'Title and URL are required'
            });
        }

        const footer = await getOrCreateFooter();

        const newLink = {
            title: title.trim(),
            url: url.trim(),
            isEnabled,
            openInNewTab,
            order
        };

        footer.quickLinks.links.push(newLink);
        await footer.save();

        console.log(`✅ Quick link added: ${title}`);

        res.status(201).json({
            success: true,
            message: 'Quick link added successfully',
            data: newLink
        });
    } catch (error) {
        console.error('❌ Error adding quick link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add quick link',
            error: error.message
        });
    }
};

// Update quick link
const updateQuickLink = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(`📝 Updating quick link at index: ${id}`);

        const footer = await getOrCreateFooter();
        const linkIndex = parseInt(id);

        if (linkIndex < 0 || linkIndex >= footer.quickLinks.links.length) {
            return res.status(404).json({
                success: false,
                message: 'Quick link not found'
            });
        }

        Object.assign(footer.quickLinks.links[linkIndex], updateData);
        await footer.save();

        console.log(`✅ Quick link updated successfully`);

        res.status(200).json({
            success: true,
            message: 'Quick link updated successfully',
            data: footer.quickLinks.links[linkIndex]
        });
    } catch (error) {
        console.error('❌ Error updating quick link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quick link',
            error: error.message
        });
    }
};

// Delete quick link
const deleteQuickLink = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Deleting quick link at index: ${id}`);

        const footer = await getOrCreateFooter();
        const linkIndex = parseInt(id);

        if (linkIndex < 0 || linkIndex >= footer.quickLinks.links.length) {
            return res.status(404).json({
                success: false,
                message: 'Quick link not found'
            });
        }

        const deletedLink = footer.quickLinks.links[linkIndex];
        footer.quickLinks.links.splice(linkIndex, 1);
        await footer.save();

        console.log(`✅ Quick link deleted successfully`);

        res.status(200).json({
            success: true,
            message: 'Quick link deleted successfully',
            data: deletedLink
        });
    } catch (error) {
        console.error('❌ Error deleting quick link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete quick link',
            error: error.message
        });
    }
};

// ===== SERVICES OPERATIONS =====

// Add service
const addService = async (req, res) => {
    try {
        console.log('📝 Adding new service...');

        const { title, description = '', url = '', isEnabled = true, order = 0 } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const footer = await getOrCreateFooter();

        const newService = {
            title: title.trim(),
            description: description.trim(),
            url: url.trim(),
            isEnabled,
            order
        };

        footer.ourServices.services.push(newService);
        await footer.save();

        console.log(`✅ Service added: ${title}`);

        res.status(201).json({
            success: true,
            message: 'Service added successfully',
            data: newService
        });
    } catch (error) {
        console.error('❌ Error adding service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add service',
            error: error.message
        });
    }
};

// ===== CALCULATORS OPERATIONS =====

// Add calculator
const addCalculator = async (req, res) => {
    try {
        console.log('📝 Adding new calculator...');

        const { title, description = '', url, icon = '', isEnabled = true, order = 0 } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                success: false,
                message: 'Title and URL are required'
            });
        }

        const footer = await getOrCreateFooter();

        const newCalculator = {
            title: title.trim(),
            description: description.trim(),
            url: url.trim(),
            icon: icon.trim(),
            isEnabled,
            order
        };

        footer.calculators.calculatorList.push(newCalculator);
        await footer.save();

        console.log(`✅ Calculator added: ${title}`);

        res.status(201).json({
            success: true,
            message: 'Calculator added successfully',
            data: newCalculator
        });
    } catch (error) {
        console.error('❌ Error adding calculator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add calculator',
            error: error.message
        });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(`📝 Updating service at index: ${id}`);

        const footer = await getOrCreateFooter();
        const serviceIndex = parseInt(id);

        if (serviceIndex < 0 || serviceIndex >= footer.ourServices.services.length) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        Object.assign(footer.ourServices.services[serviceIndex], updateData);
        await footer.save();

        console.log(`✅ Service updated successfully`);

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: footer.ourServices.services[serviceIndex]
        });
    } catch (error) {
        console.error('❌ Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error.message
        });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Deleting service at index: ${id}`);

        const footer = await getOrCreateFooter();
        const serviceIndex = parseInt(id);

        if (serviceIndex < 0 || serviceIndex >= footer.ourServices.services.length) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const deletedService = footer.ourServices.services[serviceIndex];
        footer.ourServices.services.splice(serviceIndex, 1);
        await footer.save();

        console.log(`✅ Service deleted successfully`);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
            data: deletedService
        });
    } catch (error) {
        console.error('❌ Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message
        });
    }
};

// Update calculator
const updateCalculator = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log(`📝 Updating calculator at index: ${id}`);

        const footer = await getOrCreateFooter();
        const calculatorIndex = parseInt(id);

        if (calculatorIndex < 0 || calculatorIndex >= footer.calculators.calculatorList.length) {
            return res.status(404).json({
                success: false,
                message: 'Calculator not found'
            });
        }

        Object.assign(footer.calculators.calculatorList[calculatorIndex], updateData);
        await footer.save();

        console.log(`✅ Calculator updated successfully`);

        res.status(200).json({
            success: true,
            message: 'Calculator updated successfully',
            data: footer.calculators.calculatorList[calculatorIndex]
        });
    } catch (error) {
        console.error('❌ Error updating calculator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update calculator',
            error: error.message
        });
    }
};

// Delete calculator
const deleteCalculator = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`🗑️ Deleting calculator at index: ${id}`);

        const footer = await getOrCreateFooter();
        const calculatorIndex = parseInt(id);

        if (calculatorIndex < 0 || calculatorIndex >= footer.calculators.calculatorList.length) {
            return res.status(404).json({
                success: false,
                message: 'Calculator not found'
            });
        }

        const deletedCalculator = footer.calculators.calculatorList[calculatorIndex];
        footer.calculators.calculatorList.splice(calculatorIndex, 1);
        await footer.save();

        console.log(`✅ Calculator deleted successfully`);

        res.status(200).json({
            success: true,
            message: 'Calculator deleted successfully',
            data: deletedCalculator
        });
    } catch (error) {
        console.error('❌ Error deleting calculator:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete calculator',
            error: error.message
        });
    }
};

// ===== SOCIAL LINKS OPERATIONS =====

// Add social link
const addSocialLink = async (req, res) => {
    try {
        console.log('📝 Adding new social link...');

        const { platform, url, icon = '', isEnabled = true, order = 0 } = req.body;

        if (!platform || !url) {
            return res.status(400).json({
                success: false,
                message: 'Platform and URL are required'
            });
        }

        const footer = await getOrCreateFooter();

        const newSocialLink = {
            platform,
            url: url.trim(),
            icon: icon.trim(),
            isEnabled,
            order
        };

        footer.contactUs.followUs.socialLinks.push(newSocialLink);
        await footer.save();

        console.log(`✅ Social link added: ${platform}`);

        res.status(201).json({
            success: true,
            message: 'Social link added successfully',
            data: newSocialLink
        });
    } catch (error) {
        console.error('❌ Error adding social link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add social link',
            error: error.message
        });
    }
};

// ===== PUBLIC FOOTER ENDPOINTS =====

// Get public footer data (no authentication required)
const getPublicFooter = async (req, res) => {
    try {
        console.log('📊 Fetching public footer data...');

        const footer = await getOrCreateFooter();

        // Return only public data
        const publicFooterData = {
            aboutUs: {
                description: footer.aboutUs.description,
                readMoreButton: footer.aboutUs.readMoreButton.isEnabled ? {
                    text: footer.aboutUs.readMoreButton.text,
                    url: footer.aboutUs.readMoreButton.url
                } : null
            },
            quickLinks: {
                title: footer.quickLinks.title,
                links: footer.getVisibleQuickLinks()
            },
            ourServices: {
                title: footer.ourServices.title,
                services: footer.getVisibleServices()
            },
            calculators: {
                title: footer.calculators.title,
                calculatorList: footer.getVisibleCalculators()
            },
            optimizeStrategy: footer.optimizeStrategy.showInFooter ? {
                title: footer.optimizeStrategy.title,
                strategies: footer.getVisibleOptimizeStrategies()
            } : null,
            contactUs: {
                title: footer.contactUs.title,
                address: footer.getFullAddress(),
                phoneNumber: footer.contactUs.phoneNumber,
                email: footer.contactUs.email,
                followUs: {
                    title: footer.contactUs.followUs.title,
                    socialLinks: footer.getVisibleSocialLinks()
                }
            },
            backgroundColor: footer.backgroundColor,
            textColor: footer.textColor,
            copyrightText: footer.formattedCopyright,
            privacyPolicy: {
                title: footer.privacyPolicy.title
            },
            termsOfService: {
                title: footer.termsOfService.title
            },
            legalDisclaimer: {
                title: footer.legalDisclaimer.title
            }
        };

        console.log('✅ Public footer data retrieved successfully');

        res.status(200).json({
            success: true,
            message: 'Public footer data retrieved successfully',
            data: publicFooterData
        });
    } catch (error) {
        console.error('❌ Error fetching public footer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch public footer data',
            error: error.message
        });
    }
};

export {
    // General footer operations
    getFooter,
    updateFooter,
    getPublicFooter,

    // Optimize strategy operations
    getAllOptimizeStrategies,
    getPaginatedOptimizeStrategies,
    searchOptimizeStrategies,
    getOptimizeStrategyById,
    createOptimizeStrategy,
    updateOptimizeStrategy,
    deleteOptimizeStrategy,
    getActiveOptimizeStrategy,

    // Quick links operations
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,

    // Services operations
    addService,
    updateService,
    deleteService,

    // Calculators operations
    addCalculator,
    updateCalculator,
    deleteCalculator,

    // Social links operations
    addSocialLink
};
