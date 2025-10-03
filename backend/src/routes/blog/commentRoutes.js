// routes/commentRoutes.js
import express from 'express';
import {
    createComment,
    getCommentsByBlog,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment
} from '../../controllers/blog/commentController.js';

const router = express.Router();

// Create comment or reply
router.post('/:slug/comments', createComment);

// Get all comments for a blog
router.get('/:slug/comments', getCommentsByBlog);

// Update comment
router.put('/comments/:id', updateComment);

// Delete comment
router.delete('/comments/:id', deleteComment);

// Like comment
router.post('/comments/:id/like', likeComment);

// Dislike comment
router.post('/comments/:id/dislike', dislikeComment);

export default router;