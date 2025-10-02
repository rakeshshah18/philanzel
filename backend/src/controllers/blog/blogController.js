import Blog from "../../models/blog/blog.js";
import slugify from "slugify";

// 📌 Create a new blog
export const createBlog = async (req, res) => {
    try {
        const { title, content, coverImage, author } = req.body;

        const slug = slugify(title, { lower: true, strict: true });

        const blog = new Blog({
            title,
            slug,
            content,
            coverImage,
            author,
        });

        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: "Failed to create blog" });
    }
};

// 📌 Get all blogs (with filters, search, pagination, sorting)
export const getBlogs = async (req, res) => {
    try {
        const { category, search, published, page = 1, limit = 10, sort = "-createdAt" } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (published !== undefined) filter.isPublished = published === "true";
        if (search) filter.title = { $regex: search, $options: "i" };

        const skip = (page - 1) * limit;

        const blogs = await Blog.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Blog.countDocuments(filter);

        res.json({
            status: "success",
            count: blogs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 📌 Get single blog by slug
export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ status: "error", message: "Blog not found" });

        res.json({ status: "success", data: blog });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// 📌 Update blog by slug
export const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) return res.status(404).json({ status: "error", message: "Blog not found" });

        res.json({
            status: "success",
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

// 📌 Delete blog by slug
export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findOneAndDelete({ slug: req.params.slug });

        if (!deletedBlog) return res.status(404).json({ status: "error", message: "Blog not found" });

        res.json({ status: "success", message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
