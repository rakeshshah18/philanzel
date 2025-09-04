import mongoose from "mongoose";

const calculatorPageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sections: [{
        _id: { type: mongoose.Schema.Types.ObjectId },
        sectionName: String,
        heading: String,
        content: String,
        faqs: Array
    }],
    createdAt: { type: Date, default: Date.now }
});

const CalculatorPage = mongoose.model("CalculatorPage", calculatorPageSchema);

export default CalculatorPage;