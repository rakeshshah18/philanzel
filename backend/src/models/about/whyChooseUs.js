import mongoose from 'mongoose';

const whyChooseUsSchema = new mongoose.Schema({
    // Common section content
    image: {
        url: {
            type: String,
            required: true
        },
        altText: {
            type: String,
            default: function () {
                return this.heading || 'Why Choose Us Image';
            }
        }
    },
    heading: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    button: {
        text: {
            type: String,
            required: true,
            trim: true
        },
        link: {
            type: String,
            required: true,
            trim: true
        }
    },
    // Points array
    points: [{
        icon: {
            type: String,
            required: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Additional fields
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'whychooseus'
});

// Create indexes for better performance
whyChooseUsSchema.index({ isActive: 1, order: 1 });
whyChooseUsSchema.index({ createdAt: -1 });

// Pre-save middleware to set default alt text
whyChooseUsSchema.pre('save', function (next) {
    if (this.image && this.image.url && !this.image.altText) {
        this.image.altText = this.heading || 'Why Choose Us Image';
    }
    next();
});

// Instance method to add a point
whyChooseUsSchema.methods.addPoint = function (pointData) {
    const newOrder = this.points.length;
    this.points.push({
        ...pointData,
        order: pointData.order !== undefined ? pointData.order : newOrder
    });
    return this.save();
};

// Instance method to remove a point
whyChooseUsSchema.methods.removePoint = function (pointId) {
    this.points = this.points.filter(point => point._id.toString() !== pointId.toString());
    // Reorder remaining points
    this.points.forEach((point, index) => {
        point.order = index;
    });
    return this.save();
};

// Instance method to reorder points
whyChooseUsSchema.methods.reorderPoints = function () {
    this.points.sort((a, b) => (a.order || 0) - (b.order || 0));
    this.points.forEach((point, index) => {
        point.order = index;
    });
    return this.save();
};

// Static method to get active content
whyChooseUsSchema.statics.getActive = function () {
    return this.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
};

// Static method to get content with populated points ordered correctly
whyChooseUsSchema.statics.getWithOrderedPoints = function (conditions = {}) {
    return this.aggregate([
        { $match: conditions },
        {
            $addFields: {
                points: {
                    $sortArray: {
                        input: "$points",
                        sortBy: { order: 1 }
                    }
                }
            }
        },
        { $sort: { order: 1, createdAt: -1 } }
    ]);
};

const AboutWhyChooseUs = mongoose.model("AboutWhyChooseUs", aboutWhyChooseUsSchema, 'whychooseus');

export default AboutWhyChooseUs;
