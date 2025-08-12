import mongoose from 'mongoose';

const partnerPostSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
        maxlength: [200, 'Heading cannot exceed 200 characters']
    },
    thought: {
        type: String,
        required: [true, 'Thought is required'],
        trim: true,
        maxlength: [500, 'Thought cannot exceed 500 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    }
}, {
    timestamps: true
});

const PartnerPost = mongoose.model('PartnerPost', partnerPostSchema);

export default PartnerPost;
