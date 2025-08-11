import mongoose from "mongoose";
const careerSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: false,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    image: {
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

const CareerPost = mongoose.model("CareerPost", careerSchema);
export default CareerPost;