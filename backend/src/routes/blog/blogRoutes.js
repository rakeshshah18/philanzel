import express from "express";
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
} from "../../controllers/blog/blogController.js";

const router = express.Router();
router.get("/public", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", createBlog);
router.put("/:slug", updateBlog);
router.delete("/:slug", deleteBlog);

export default router;
