import mongoose from 'mongoose';

const whyChoosePhilanzelSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    points: [{
        description: {
            type: String,
            required: true
        }
    }]
});

const WhyChoosePhilanzel = mongoose.model('WhyChoosePhilanzel', whyChoosePhilanzelSchema);

export default WhyChoosePhilanzel;
