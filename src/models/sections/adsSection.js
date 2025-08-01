import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
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
    hastag: {
        type: String,
        required: [true, 'Hashtag is required'],
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        trim: true,
    }
}, {
    timestamps: true
});

const Ads = mongoose.model('Ads', adsSchema);

export default Ads;