import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: { type: String, required: false },
    answer: { type: String, required: false }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
    heading: [{ type: String, default: '' }],
    description: [{ type: String, default: '' }],
    subheading: [{ type: String, default: '' }],
    subdescription: [{ type: String, default: '' }],
    images: [{ type: String, default: '' }], // Array of image URLs
    faqs: { type: [faqSchema], default: [] },          // Array of FAQ objects
    // Removed extraSubheading, extraSubdescription, extraImage
    // Add more optional fields here as needed
}, { timestamps: true });

export default mongoose.model("Section", sectionSchema);
