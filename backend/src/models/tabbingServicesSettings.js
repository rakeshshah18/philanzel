import mongoose from "mongoose";

const tabbingServicesSettingsSchema = new mongoose.Schema({
    commonBackgroundImage: {
        url: {
            type: String,
            default: '/images/services/default-service.svg',
            trim: true
        },
        originalName: {
            type: String,
            required: false
        },
        filename: {
            type: String,
            required: false
        },
        path: {
            type: String,
            required: false
        },
        size: {
            type: Number,
            required: false
        },
        mimetype: {
            type: String,
            required: false
        }
    },
    commonImageDescription: {
        type: String,
        default: 'Transform your financial future with our comprehensive services',
        trim: true
    },
    commonImageButton: {
        text: {
            type: String,
            default: 'Get Started',
            trim: true
        },
        link: {
            type: String,
            default: '#',
            trim: true
        }
    },
    // Future settings can be added here
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const TabbingServicesSettings = mongoose.model("TabbingServicesSettings", tabbingServicesSettingsSchema);

export default TabbingServicesSettings;
