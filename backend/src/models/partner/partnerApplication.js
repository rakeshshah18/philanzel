import mongoose from 'mongoose';

const partnerApplicationSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    personName: {
        type: String,
        required: [true, 'Person name is required'],
        trim: true,
        maxlength: [100, 'Person name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const PartnerApplication = mongoose.model('PartnerApplication', partnerApplicationSchema);

export default PartnerApplication;
