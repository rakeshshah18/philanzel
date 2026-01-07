import mongoose from "mongoose";

const ourJourneySchema = new mongoose.Schema({
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
    collection: 'ourjourney'
});
ourJourneySchema.index({ order: 1, isActive: 1 });
ourJourneySchema.index({ createdAt: -1 });
ourJourneySchema.index({ 'cards.year': 1 });

export default mongoose.model('OurJourney', ourJourneySchema);
