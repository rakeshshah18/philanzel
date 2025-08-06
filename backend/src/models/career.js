import mongoose from "mongoose";
const careerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    resume: {
        originalName: {
            type: String,
            required: false
        },
        filename: {
            type: String,
            required: false
        },
        path: {
            type: String,
            required: false
        },
        size: {
            type: Number,
            required: false
        },
        mimetype: {
            type: String,
            required: false
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Career = mongoose.model("Career", careerSchema);
export default Career;