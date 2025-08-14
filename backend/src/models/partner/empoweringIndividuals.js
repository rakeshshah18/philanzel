import mongoose from 'mongoose';

const empoweringIndividualsSchema = new mongoose.Schema({
    commonDescription: { type: String, required: true },
    content: [{
        heading: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

const EmpoweringIndividuals = mongoose.model('EmpoweringIndividuals', empoweringIndividualsSchema);

export default EmpoweringIndividuals;
