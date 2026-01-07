import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    hashtag: {
        type: String,
        required: false,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    linkUrl: {
        type: String,
        required: false,
        trim: true,
    },
    backgroundColor: {
        type: String,
        default: '#ffffff',
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