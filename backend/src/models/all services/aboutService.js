import mongoose from 'mongoose';

const aboutServiceSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false // Optional, can be empty
    },
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

const AboutService = mongoose.model('AboutService', aboutServiceSchema);
export default AboutService;
