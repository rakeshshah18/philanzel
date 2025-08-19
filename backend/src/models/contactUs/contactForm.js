import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    servicesType: {
        type: String,
        required: true,
        enum: [
            'Million Dollar Club - (MDC)',
            'Retirement Solutions',
            'Mutual Funds',
            'Insurance',
            'Training & Handholding',
            'Alternative Investment Fund (AIF)',
            'Health Insurance',
            'Portfolio Management Services (PMS)',
            'PE FUND'
        ]
    },
    createdAt: { type: Date, default: Date.now }
});

const ContactForm = mongoose.model('ContactForm', contactFormSchema);
export default ContactForm;
