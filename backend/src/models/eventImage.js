import mongoose from 'mongoose';

const eventImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EventImage = mongoose.model('EventImage', eventImageSchema);
export default EventImage;