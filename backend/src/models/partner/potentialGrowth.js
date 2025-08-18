import mongoose from "mongoose";

const potentialGrowthSchema = new mongoose.Schema({
    commonHeading: {
        type: String,
        required: true
    },
    commonDescription: {
        type: String,
        required: true
    },
    solutions: [{
        heading: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    }]
});
const PotentialGrowth = mongoose.model('PotentialGrowth', potentialGrowthSchema);
export default PotentialGrowth;