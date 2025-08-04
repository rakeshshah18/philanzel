import mongoose from 'mongoose';

const optimizeStrategySchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
        maxlength: [200, 'Heading cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
optimizeStrategySchema.index({ heading: 'text', description: 'text' });
optimizeStrategySchema.index({ createdAt: -1 });

// Virtual for formatted creation date
optimizeStrategySchema.virtual('formattedCreatedAt').get(function () {
    return this.createdAt.toLocaleDateString();
});

// Static method to get active strategies
optimizeStrategySchema.statics.getActiveStrategies = function () {
    return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to search strategies
optimizeStrategySchema.statics.searchStrategies = function (query) {
    return this.find({
        $or: [
            { heading: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    }).sort({ createdAt: -1 });
};

const OptimizeStrategy = mongoose.model('OptimizeStrategy', optimizeStrategySchema);

export default OptimizeStrategy;
