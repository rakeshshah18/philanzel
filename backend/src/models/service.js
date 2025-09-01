import mongoose from "mongoose";

const ourServicesSchema = new mongoose.Schema({
    sections: [
        {
            title: { type: String, required: true },
            name: { type: String },
            heading: [{ type: String }],
            description: [{ type: String }],
            subheading: [{ type: String }],
            subdescription: [{ type: String }],
            points: [{ type: String }],
            images: [{ type: String }],
            faqs: [
                {
                    question: { type: String },
                    answer: { type: String }
                }
            ],
            content: { type: String },
            image: { type: String, default: '' },
        }
    ],
    // Legacy fields for backward compatibility
    name: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },

    // New tabbing services fields
    title: {
        type: String,
        required: function () {
            // Only require for new documents, not updates
            return this.isNew;
        },
        trim: true
    },
    tabTitle: {
        type: String,
        required: function () {
            // Only require for new documents, not updates
            return this.isNew;
        },
        trim: true
    },
    contentTitle: {
        type: String,
        required: function () {
            // Only require for new documents, not updates
            return this.isNew;
        },
        trim: true
    },
    buttonText: {
        type: String,
        default: 'Learn More',
        trim: true
    },
    color: {
        type: String,
        default: 'primary',
        enum: ['primary', 'success', 'info', 'warning', 'dark', 'danger', 'secondary']
    },
    icon: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const OurServices = mongoose.model("OurServices", ourServicesSchema);

export default OurServices;
