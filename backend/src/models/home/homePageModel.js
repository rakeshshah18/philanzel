import mongoose from "mongoose";

const homePageSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    button: {
        text: {
            type: String,
            required: true,
            trim: true
        },
        link: {
            type: String,
            required: true,
            trim: true
        }
    },
    image: {
        url: {
            type: String,
            required: false,
            trim: true
        },
        altText: {
            type: String,
            required: true,
            trim: true
        },
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
});

const HomePage = mongoose.model("HomePage", homePageSchema);

export default HomePage;
