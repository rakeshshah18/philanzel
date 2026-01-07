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
router.post('/:slug/comments', createComment);
router.get('/:slug/comments', getCommentsByBlog);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/like', likeComment);
router.post('/comments/:id/dislike', dislikeComment);

export default router;