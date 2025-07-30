import mongoose from 'mongoose';

const helpedIndustriesSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, 'Heading is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    industries: [{
        name: {
            type: String,
            required: [true, 'Industry name is required'],
            trim: true,
        },
        icon: {
            type: String,
            required: [true, 'Industry icon is required'],
            trim: true,
        }
    }],
}, {
    timestamps: true,
});

export default mongoose.model('HelpedIndustries', helpedIndustriesSchema);