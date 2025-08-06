import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: false, // Made optional
        // Removed trim to support HTML content from rich text editor
    },
    hashtag: {
        type: String,
        required: false, // Made optional
        trim: true,
    },
    imageUrl: {
        type: String,
        required: false, // Main image - can be uploaded file or URL
        trim: true,
    },
    linkUrl: {
        type: String,
        required: false, // External link for the ad (where it redirects when clicked)
        trim: true,
    },
    backgroundColor: {
        type: String,
        default: '#ffffff', // Default white background
        validate: {
            validator: function (v) {
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: 'Background color must be a valid hex color code'
        }
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const AdsSection = mongoose.model('AdsSection', adsSchema);

export default AdsSection;