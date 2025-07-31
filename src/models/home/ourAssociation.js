import mongoose from "mongoose";

const imageSchema = {
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
    alt: {
        type: String,
        default: '',
        trim: true
    }
};

const ourAssociationSchema = new mongoose.Schema({
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
    button: {
        text: {
            type: String,
            default: 'Learn More',
            trim: true
        },
        link: {
            type: String,
            default: '#',
            trim: true
        }
    },
    rowOne: [imageSchema],
    rowTwo: [imageSchema],
    rowThree: [imageSchema]
}, {
    timestamps: true
});

const OurAssociation = mongoose.model("OurAssociation", ourAssociationSchema);

export default OurAssociation;