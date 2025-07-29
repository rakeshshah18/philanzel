import mongoose from "mongoose";


const ourServicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});
const OurServices = mongoose.model("OurServices", ourServicesSchema);

export default OurServices;
