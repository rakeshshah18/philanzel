import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    servicesType: {
        type: String,
        required: true,
        enum: [
            'service 1',
            'service 2',
            'service 3',
            'service 4',
            'service 5',
            'service 6',
            'service 7',
            'service 8'
        ]
    },
    createdAt: { type: Date, default: Date.now }
});

const ContactForm = mongoose.model('ContactForm', contactFormSchema);
export default ContactForm;
