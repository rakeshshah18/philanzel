import mongoose from "mongoose";

const ourFounderSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
        },
        altText: {
            type: String,
        },
    },
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export default mongoose.model("OurFounder", ourFounderSchema);
