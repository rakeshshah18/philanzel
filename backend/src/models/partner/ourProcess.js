import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
    icon: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const ourProcessSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: [stepSchema] // Flexible array of steps
});

const OurProcess = mongoose.model("OurProcess", ourProcessSchema);

export default OurProcess;
