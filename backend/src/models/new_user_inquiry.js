import mongoose from "mongoose";


const inquiryType = [
    "Million Dollar Club - (MDC)",
    "Retirement Solutions",
    "Mutual Funds",
    "Insurance",
    "Training & Handholding",
    "Alternative Investment Fund (AIF)",
    "Health Insurance",
    "Portfolio Management Services (PMS)",
    "PE FUND"]


const newUserInquirySchema = new mongoose.Schema({
    inquiryType: {
        type: String,
        enum: inquiryType,
        trim: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    ,
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NewUserInquiry = mongoose.model("NewUserInquiry", newUserInquirySchema);

export default NewUserInquiry;
