import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
        },
        slug: { type: String, required: true, unique: true },
        content: {
            type: String,
            required: [true, "Blog content is required"],
        },
        category: {
            type: String,
            default: "Other",
        },
        readTime: {
            type: Number,
            required: false,
        },
        tags: {
            type: [String],
            default: [],
        },
        coverImage: {
            type: String,
            default: "",
        },
        author: {
            type: String,
            default: "Rajdeep Singh",
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
blogSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
    }
    next();
});

export default mongoose.model("Blog", blogSchema);

