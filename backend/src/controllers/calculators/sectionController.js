import CalculatorSection from "../../models/calculators/calculatorSections.js";

// Create a new calculator section
export const createSection = async (req, res) => {
    try {
        // Accept sectionName from frontend
        const section = new CalculatorSection({
            sectionName: req.body.sectionName,
            heading: req.body.heading,
            content: req.body.content,
            faqs: req.body.faqs || []
        });
        await section.save();
        res.status(201).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all calculator sections
export const getSections = async (req, res) => {
    try {
        const sections = await CalculatorSection.find();
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single calculator section by ID
export const getSectionById = async (req, res) => {
    try {
        const section = await CalculatorSection.findById(req.params.id);
        if (!section) return res.status(404).json({ error: "Section not found" });
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a calculator section by ID
export const updateSection = async (req, res) => {
    try {
        // Allow sectionName to be updated from frontend
        const section = await CalculatorSection.findById(req.params.id);
        if (!section) return res.status(404).json({ error: "Section not found" });
        section.sectionName = req.body.sectionName;
        section.heading = req.body.heading;
        section.content = req.body.content;
        section.faqs = req.body.faqs || [];
        await section.save();
        res.status(200).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a calculator section by ID
export const deleteSection = async (req, res) => {
    try {
        const section = await CalculatorSection.findByIdAndDelete(req.params.id);
        if (!section) return res.status(404).json({ error: "Section not found" });
        res.status(200).json({ message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
