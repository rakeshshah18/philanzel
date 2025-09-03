import express from "express";
import {
    createSection,
    getSections,
    getSectionById,
    updateSection,
    deleteSection
} from "../../controllers/calculators/sectionController.js";

const router = express.Router();

// Create a new calculator section
router.post("/", createSection);

// Get all calculator sections
router.get("/", getSections);

// Get a single calculator section by ID
router.get("/:id", getSectionById);

// Update a calculator section by ID
router.put("/:id", updateSection);

// Delete a calculator section by ID
router.delete("/:id", deleteSection);

export default router;
