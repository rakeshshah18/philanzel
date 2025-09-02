import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: { type: String, required: false },
    description: { type: String, required: false }
}, { _id: false });

const calculatorSectionSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true },
    faqs: [faqSchema]
});

export default mongoose.model("CalculatorSection", calculatorSectionSchema);
