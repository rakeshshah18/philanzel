import PotentialGrowth from '../../models/partner/potentialGrowth.js';


// Create a new PotentialGrowth document
export const createPotentialGrowth = async (req, res) => {
    try {
        const potentialGrowth = new PotentialGrowth(req.body);
        await potentialGrowth.save();
        res.status(201).json(potentialGrowth);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all PotentialGrowth documents
export const getAllPotentialGrowth = async (req, res) => {
    console.log('Received request for PotentialGrowth');
    try {
        const potentialGrowths = await PotentialGrowth.find();
        console.log('PotentialGrowths found:', JSON.stringify(potentialGrowths, null, 2));
        res.json(potentialGrowths);
    } catch (error) {
        console.error('PotentialGrowth fetch error:', error);
        if (error.stack) console.error(error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Get a single PotentialGrowth by ID
export const getPotentialGrowthById = async (req, res) => {
    try {
        const potentialGrowth = await PotentialGrowth.findById(req.params.id);
        if (!potentialGrowth) {
            return res.status(404).json({ error: 'PotentialGrowth not found' });
        }
        res.json(potentialGrowth);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a PotentialGrowth by ID
export const updatePotentialGrowth = async (req, res) => {
    try {
        const potentialGrowth = await PotentialGrowth.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!potentialGrowth) {
            return res.status(404).json({ error: 'PotentialGrowth not found' });
        }
        res.json(potentialGrowth);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a PotentialGrowth by ID
export const deletePotentialGrowth = async (req, res) => {
    try {
        const potentialGrowth = await PotentialGrowth.findByIdAndDelete(req.params.id);
        if (!potentialGrowth) {
            return res.status(404).json({ error: 'PotentialGrowth not found' });
        }
        res.json({ message: 'PotentialGrowth deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
