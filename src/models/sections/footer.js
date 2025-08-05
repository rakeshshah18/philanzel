import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
    // About Us Section
    aboutUs: {
        description: {
            type: String,
            required: [true, 'About Us description is required'],
            trim: true,
            maxlength: [1000, 'About Us description cannot exceed 1000 characters']
        },
        readMoreButton: {
            text: {
                type: String,
                default: 'Read More',
                maxlength: [50, 'Read More button text cannot exceed 50 characters']
            },
            url: {
                type: String,
                required: [true, 'Read More button URL is required'],
                trim: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            }
        }
    },

    // Quick Links Section
    quickLinks: {
        title: {
            type: String,
            default: 'Quick Links',
            maxlength: [100, 'Quick Links title cannot exceed 100 characters']
        },
        links: [{
            title: {
                type: String,
                required: [true, 'Quick link title is required'],
                trim: true,
                maxlength: [100, 'Quick link title cannot exceed 100 characters']
            },
            url: {
                type: String,
                required: [true, 'Quick link URL is required'],
                trim: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            openInNewTab: {
                type: Boolean,
                default: false
            },
            order: {
                type: Number,
                default: 0
            }
        }]
    },

    // Our Services Section
    ourServices: {
        title: {
            type: String,
            default: 'Our Services',
            maxlength: [100, 'Our Services title cannot exceed 100 characters']
        },
        services: [{
            title: {
                type: String,
                required: [true, 'Service title is required'],
                trim: true,
                maxlength: [200, 'Service title cannot exceed 200 characters']
            },
            description: {
                type: String,
                trim: true,
                maxlength: [500, 'Service description cannot exceed 500 characters']
            },
            url: {
                type: String,
                trim: true
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            order: {
                type: Number,
                default: 0
            }
        }]
    },

    // Calculators Section
    calculators: {
        title: {
            type: String,
            default: 'Calculators',
            maxlength: [100, 'Calculators title cannot exceed 100 characters']
        },
        calculatorList: [{
            title: {
                type: String,
                required: [true, 'Calculator title is required'],
                trim: true,
                maxlength: [200, 'Calculator title cannot exceed 200 characters']
            },
            description: {
                type: String,
                trim: true,
                maxlength: [300, 'Calculator description cannot exceed 300 characters']
            },
            url: {
                type: String,
                required: [true, 'Calculator URL is required'],
                trim: true
            },
            icon: {
                type: String,
                trim: true,
                maxlength: [100, 'Calculator icon cannot exceed 100 characters']
            },
            isEnabled: {
                type: Boolean,
                default: true
            },
            order: {
                type: Number,
                default: 0
            }
        }]
    },

    // Optimize Strategy Section
    optimizeStrategy: {
        title: {
            type: String,
            default: 'Optimize Strategy',
            maxlength: [100, 'Optimize Strategy title cannot exceed 100 characters']
        },
        strategies: [{
            heading: {
                type: String,
                required: [true, 'Strategy heading is required'],
                trim: true,
                maxlength: [200, 'Strategy heading cannot exceed 200 characters']
            },
            description: {
                type: String,
                required: [true, 'Strategy description is required'],
                trim: true,
                maxlength: [1000, 'Strategy description cannot exceed 1000 characters']
            },
            buttonText: {
                type: String,
                trim: true,
                maxlength: [50, 'Button text cannot exceed 50 characters']
            },
            buttonUrl: {
                type: String,
                trim: true
            },
            isActive: {
                type: Boolean,
                default: false
            },
            isVisible: {
                type: Boolean,
                default: true
            },
            order: {
                type: Number,
                default: 0
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }],
        displayLimit: {
            type: Number,
            default: 3,
            min: [1, 'Display limit must be at least 1'],
            max: [10, 'Display limit cannot exceed 10']
        },
        showInFooter: {
            type: Boolean,
            default: true
        }
    },

    // Contact Us Section
    contactUs: {
        title: {
            type: String,
            default: 'Contact Us',
            maxlength: [100, 'Contact Us title cannot exceed 100 characters']
        },
        address: {
            street: {
                type: String,
                required: [true, 'Street address is required'],
                trim: true,
                maxlength: [200, 'Street address cannot exceed 200 characters']
            },
            city: {
                type: String,
                required: [true, 'City is required'],
                trim: true,
                maxlength: [100, 'City cannot exceed 100 characters']
            },
            state: {
                type: String,
                required: [true, 'State is required'],
                trim: true,
                maxlength: [100, 'State cannot exceed 100 characters']
            },
            zipCode: {
                type: String,
                required: [true, 'Zip code is required'],
                trim: true,
                maxlength: [20, 'Zip code cannot exceed 20 characters']
            },
            country: {
                type: String,
                required: [true, 'Country is required'],
                trim: true,
                maxlength: [100, 'Country cannot exceed 100 characters']
            }
        },
        phoneNumber: {
            primary: {
                type: String,
                required: [true, 'Primary phone number is required'],
                trim: true,
                maxlength: [20, 'Phone number cannot exceed 20 characters']
            },
            secondary: {
                type: String,
                trim: true,
                maxlength: [20, 'Secondary phone number cannot exceed 20 characters']
            }
        },
        email: {
            primary: {
                type: String,
                required: [true, 'Primary email is required'],
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
            },
            secondary: {
                type: String,
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
            }
        },
        followUs: {
            title: {
                type: String,
                default: 'Follow Us',
                maxlength: [50, 'Follow Us title cannot exceed 50 characters']
            },
            socialLinks: [{
                platform: {
                    type: String,
                    required: [true, 'Social platform name is required'],
                    enum: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'WhatsApp', 'Telegram', 'Other'],
                    trim: true
                },
                url: {
                    type: String,
                    required: [true, 'Social link URL is required'],
                    trim: true
                },
                icon: {
                    type: String,
                    trim: true,
                    maxlength: [100, 'Social icon class cannot exceed 100 characters']
                },
                isEnabled: {
                    type: Boolean,
                    default: true
                },
                order: {
                    type: Number,
                    default: 0
                }
            }]
        }
    },

    // General Footer Settings
    isActive: {
        type: Boolean,
        default: true
    },
    backgroundColor: {
        type: String,
        default: '#2c3e50',
        maxlength: [50, 'Background color cannot exceed 50 characters']
    },
    textColor: {
        type: String,
        default: '#ffffff',
        maxlength: [50, 'Text color cannot exceed 50 characters']
    },
    copyrightText: {
        type: String,
        required: [true, 'Copyright text is required'],
        trim: true,
        maxlength: [200, 'Copyright text cannot exceed 200 characters']
    },

    // Legal Pages
    privacyPolicy: {
        title: {
            type: String,
            default: 'Privacy Policy',
            maxlength: [100, 'Privacy Policy title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Privacy Policy description is required'],
            trim: true,
            maxlength: [10000, 'Privacy Policy description cannot exceed 10000 characters']
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    termsOfService: {
        title: {
            type: String,
            default: 'Terms of Service',
            maxlength: [100, 'Terms of Service title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Terms of Service description is required'],
            trim: true,
            maxlength: [10000, 'Terms of Service description cannot exceed 10000 characters']
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    legalDisclaimer: {
        title: {
            type: String,
            default: 'Legal Disclaimer',
            maxlength: [100, 'Legal Disclaimer title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Legal Disclaimer description is required'],
            trim: true,
            maxlength: [10000, 'Legal Disclaimer description cannot exceed 10000 characters']
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
footerSchema.index({ isActive: 1 });
footerSchema.index({ createdAt: -1 });

// Virtual for formatted copyright text
footerSchema.virtual('formattedCopyright').get(function () {
    const currentYear = new Date().getFullYear();
    return this.copyrightText.replace('{year}', currentYear);
});

// Static method to get active footer
footerSchema.statics.getActiveFooter = function () {
    return this.findOne({ isActive: true });
};

// Method to get visible quick links
footerSchema.methods.getVisibleQuickLinks = function () {
    return this.quickLinks.links
        .filter(link => link.isEnabled)
        .sort((a, b) => a.order - b.order);
};

// Method to get visible services
footerSchema.methods.getVisibleServices = function () {
    return this.ourServices.services
        .filter(service => service.isEnabled)
        .sort((a, b) => a.order - b.order);
};

// Method to get visible calculators
footerSchema.methods.getVisibleCalculators = function () {
    return this.calculators.calculatorList
        .filter(calculator => calculator.isEnabled)
        .sort((a, b) => a.order - b.order);
};

// Method to get visible social links
footerSchema.methods.getVisibleSocialLinks = function () {
    return this.contactUs.followUs.socialLinks
        .filter(link => link.isEnabled)
        .sort((a, b) => a.order - b.order);
};

// Method to get full address string
footerSchema.methods.getFullAddress = function () {
    const addr = this.contactUs.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
};

// Method to get visible/active optimize strategies
footerSchema.methods.getVisibleOptimizeStrategies = function () {
    return this.optimizeStrategy.strategies
        .filter(strategy => strategy.isVisible && strategy.isActive)
        .sort((a, b) => a.order - b.order)
        .slice(0, this.optimizeStrategy.displayLimit);
};

// Method to get all optimize strategies for admin
footerSchema.methods.getAllOptimizeStrategies = function () {
    return this.optimizeStrategy.strategies
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Method to get active optimize strategy
footerSchema.methods.getActiveOptimizeStrategy = function () {
    return this.optimizeStrategy.strategies.find(strategy => strategy.isActive);
};

// Method to search optimize strategies
footerSchema.methods.searchOptimizeStrategies = function (query) {
    const regex = new RegExp(query, 'i');
    return this.optimizeStrategy.strategies
        .filter(strategy =>
            (strategy.heading.match(regex) || strategy.description.match(regex)) &&
            strategy.isVisible
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;