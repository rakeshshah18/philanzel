import mongoose from "mongoose";

const ourServicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const OurServices = mongoose.model("OurServices", ourServicesSchema);

export default OurServices;
