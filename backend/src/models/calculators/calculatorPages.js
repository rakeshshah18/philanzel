import mongoose from "mongoose";

const calculatorPageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const CalculatorPage = mongoose.model("CalculatorPage", calculatorPageSchema);

export default CalculatorPage;