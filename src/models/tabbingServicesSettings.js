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
