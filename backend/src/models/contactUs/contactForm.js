import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    message: { type: String, required: true },
    servicesType: {
        type: String,
        required: true
    },
    captchaToken: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

const ContactForm = mongoose.model('ContactForm', contactFormSchema);
export default ContactForm;
