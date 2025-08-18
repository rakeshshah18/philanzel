import mongoose from "mongoose";

const partnerFAQSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    faqs: [{
        question: {
            type: String,
            required: [true, 'Question is required'],
            trim: true
        },
        answer: {
            type: String,
            required: [true, 'Answer is required'],
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

const PartnerFAQ = mongoose.model("PartnerFAQ", partnerFAQSchema);

export default PartnerFAQ;
