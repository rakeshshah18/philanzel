import mongoose from "mongoose";

const ourJourneySchema = new mongoose.Schema({
    // Common heading and description for the entire section
    heading: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    // Array of journey cards/milestones
    cards: [{
        year: {
            type: String,
            required: true,
            trim: true
        },
        heading: {
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

    // Additional fields for management
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
    collection: 'ourjourney' // Explicitly set collection name to 'ourjourney'
});

// Index for better performance
ourJourneySchema.index({ order: 1, isActive: 1 });
ourJourneySchema.index({ createdAt: -1 });
ourJourneySchema.index({ 'cards.year': 1 });

export default mongoose.model('OurJourney', ourJourneySchema);
