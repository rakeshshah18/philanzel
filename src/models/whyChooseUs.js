import mongoose from "mongoose";


const whyChooseUsSchema = new mongoose.Schema({
    image: {
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
    },
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    points: [{
        text: {
            type: String,
            required: [true, 'Point text is required'],
            trim: true,
        },
        icon: {
            type: String,
            default: 'fas fa-check',
            trim: true,
        }
    }],
    button: {
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
}, {
    timestamps: true
});

const WhyChooseUs = mongoose.model("WhyChooseUs", whyChooseUsSchema);

export default WhyChooseUs;