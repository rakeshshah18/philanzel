import Comment from "../../models/blog/commentModel.js";
import Blog from "../../models/blog/blog.js";
import fetch from "node-fetch";

// ✅ CREATE COMMENT (with CAPTCHA verification)
export const createComment = async (req, res) => {
    try {
        const { author, content, parentComment, captchaToken } = req.body;
        const { slug } = req.params;

        // --- Step 1: Verify CAPTCHA ---
        if (!captchaToken) {
            return res.status(400).json({
                status: "fail",
                message: "Captcha token is required.",
            });
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

        const captchaRes = await fetch(verifyUrl, { method: "POST" });
        const captchaData = await captchaRes.json();

        if (!captchaData.success) {
            return res.status(400).json({
                status: "fail",
                message: "Captcha verification failed.",
            });
        }

        // --- Step 2: Validate fields ---
        if (!author || !content) {
            return res.status(400).json({
                status: "error",
                message: "Author and content are required.",
            });
        }

        // --- Step 3: Find the blog ---
        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return res.status(404).json({
                status: "error",
                message: "Blog not found.",
            });
        }

        // --- Step 4: Handle reply depth (max 3 levels) ---
        let depth = 1;
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({
                    status: "error",
                    message: "Parent comment not found.",
                });
            }

            if (parent.blog.toString() !== blog._id.toString()) {
                return res.status(400).json({
                    status: "error",
                    message: "Parent comment belongs to a different blog.",
                });
            }

            // Count depth up to 3
            let current = parent;
            depth = 2;
            while (current.parentComment) {
                current = await Comment.findById(current.parentComment);
                depth++;
                if (depth > 3) {
                    return res.status(400).json({
                        status: "error",
                        message: "Reply depth limit (3) exceeded.",
                    });
                }
            }
        }

        // --- Step 5: Create new comment ---
        const comment = await Comment.create({
            blog: blog._id,
            author,
            content,
            parentComment: parentComment || null,
        });

        // --- Step 6: If it's a reply, link it to the parent ---
        if (parentComment) {
            await Comment.findByIdAndUpdate(parentComment, {
                $push: { replies: comment._id },
            });
        }

        // --- Step 7: Success response ---
        res.status(201).json({
            status: "success",
            message: "Comment posted successfully.",
            data: comment,
            depth,
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error.",
            error: error.message,
        });
    }
};


// GET ALL COMMENTS FOR A BLOG (with nested replies)
export const getCommentsByBlog = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find blog by slug
        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return res.status(404).json({
                status: "error",
                message: "Blog not found"
            });
        }

        // Find only top-level comments (where parentComment is null)
        const comments = await Comment.find({
            blog: blog._id,
            parentComment: null
        })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replies',
                    populate: {
                        path: 'replies'
                    }
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// UPDATE COMMENT (edit content)
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, author } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "Comment not found"
            });
        }

        // Optional: Check if current user is the author
        if (comment.author !== author) {
            return res.status(403).json({
                status: "error",
                message: "You can only edit your own comments"
            });
        }

        comment.content = content || comment.content;
        comment.updatedAt = Date.now();
        await comment.save();

        res.status(200).json({
            status: "success",
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "Comment not found"
            });
        }

        // Delete all nested replies recursively
        await deleteCommentAndReplies(id);

        // Remove from parent's replies array if it has a parent
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(
                comment.parentComment,
                { $pull: { replies: id } }
            );
        }

        res.status(200).json({
            status: "success",
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Helper function to delete comment and all its replies
async function deleteCommentAndReplies(commentId) {
    const comment = await Comment.findById(commentId);
    if (!comment) return;

    // Recursively delete all replies
    for (const replyId of comment.replies) {
        await deleteCommentAndReplies(replyId);
    }

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);
}

// LIKE COMMENT
export const likeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // A unique ID from the client

        if (!userId) {
            return res.status(400).json({ status: "error", message: "User identifier is required." });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ status: "error", message: "Comment not found" });
        }

        const hasLiked = comment.likedBy.includes(userId);

        if (hasLiked) {
            // User has already liked, so unlike it
            comment.likedBy.pull(userId);
        } else {
            // User has not liked, so like it
            comment.likedBy.push(userId);
            comment.dislikedBy.pull(userId); // Remove from dislikes if present
        }

        await comment.save();

        // Re-fetch the comment to include virtuals in the response
        const updatedComment = await Comment.findById(id);

        res.status(200).json({
            status: "success",
            data: updatedComment
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// DISLIKE COMMENT
export const dislikeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // A unique ID from the client

        if (!userId) {
            return res.status(400).json({ status: "error", message: "User identifier is required." });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ status: "error", message: "Comment not found" });
        }

        const hasDisliked = comment.dislikedBy.includes(userId);

        if (hasDisliked) {
            // User has already disliked, so remove dislike
            comment.dislikedBy.pull(userId);
        } else {
            // User has not disliked, so dislike it
            comment.dislikedBy.push(userId);
            comment.likedBy.pull(userId); // Remove from likes if present
        }

        await comment.save();

        // Re-fetch the comment to include virtuals in the response
        const updatedComment = await Comment.findById(id);

        res.status(200).json({
            status: "success",
            data: updatedComment
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};