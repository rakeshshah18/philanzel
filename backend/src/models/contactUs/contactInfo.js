import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    points: {
        type: [String],
        required: true
    },
    address: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    updatedAt: { type: Date, default: Date.now }
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);
export default ContactInfo;
