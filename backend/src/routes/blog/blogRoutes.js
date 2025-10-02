import express from "express";
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
} from "../../controllers/blog/blogController.js";

const router = express.Router();

// Public routes for fetching blogs
router.get("/public", getBlogs); // Changed from /public to /
router.get("/:slug", getBlogBySlug); // Changed from public/:slug

// Protected routes (would require authentication middleware in a real app)
router.post("/", createBlog);
router.put("/:slug", updateBlog);
router.delete("/:slug", deleteBlog);

export default router;
