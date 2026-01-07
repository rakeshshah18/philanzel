import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
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
    button: {
        text: {
            type: String,
            required: false,
            trim: true
        },
        link: {
            type: String,
            required: false,
            trim: true
        }
    },
    image: {
        url: {
            type: String,
            required: false,
            trim: true
        },
        altText: {
            type: String,
            required: true,
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
    collection: 'aboutus' 
});
aboutUsSchema.index({ order: 1, isActive: 1 });
aboutUsSchema.index({ createdAt: -1 });

export default mongoose.model('AboutUs', aboutUsSchema);
