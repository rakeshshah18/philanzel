import mongoose from 'mongoose';

const PartnerAssociationImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PartnerAssociationImage', PartnerAssociationImageSchema);
