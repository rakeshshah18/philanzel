import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: { type: String, required: false },
    answer: { type: String, required: false }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    heading: [{ type: String, default: '' }],
    description: [{ type: String, default: '' }],
    subheading: [{ type: String, default: '' }],
    subdescription: [{ type: String, default: '' }],
    points: [{ type: String, default: '' }],
    images: [{ type: String, default: '' }],
    faqs: { type: [faqSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Section", sectionSchema);
