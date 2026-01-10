"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import ReCAPTCHA from "react-google-recaptcha"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://philanzel-backend.onrender.com";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Helper to get or create a unique user ID from localStorage
const getUserId = () => {
    if (typeof window === 'undefined') return null;
    let userId = localStorage.getItem('commentUserId');
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('commentUserId', userId);
    }
    return userId;
};

// ✅ Single Comment Component (recursive for replies)
function Comment({ comment, onReply, onLike, onDislike }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState("")

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment._id, replyText);
            setReplyText("")
            setIsReplying(false)
        }
    }

    const userId = getUserId();
    const isLiked = useMemo(() => comment.likedBy?.includes(userId), [comment.likedBy, userId]);
    const isDisliked = useMemo(() => comment.dislikedBy?.includes(userId), [comment.dislikedBy, userId]);

    return (
        <div className="flex space-x-4">
            <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author ? comment.author.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                {/* Author + Date */}
                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800">{comment.author}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Comment text */}
                <p className="text-gray-700 mt-1">{comment.content}</p>

                {/* Actions */}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <button
                        onClick={() => onLike(comment._id)}
                        className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-cyan-600' : 'hover:text-cyan-600'
                            }`}
                    >
                        <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes}</span>
                    </button>
                    <button
                        onClick={() => onDislike(comment._id)}
                        className={`flex items-center space-x-1 transition-colors ${isDisliked ? 'text-red-600' : 'hover:text-red-600'
                            }`}
                    >
                        <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                        <span>{comment.dislikes}</span>
                    </button>
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center space-x-1 hover:text-cyan-600"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Reply</span>
                    </button>
                </div>

                {/* Reply form */}
                {isReplying && (
                    <div className="mt-4 flex space-x-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="/images/avatar/avatar-1.jpg" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${comment.author}...`}
                                className="w-full"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleReplySubmit}
                                    className="bg-cyan-600 hover:bg-cyan-700"
                                >
                                    Post Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Replies */}
                <div className="mt-4 space-y-4 pl-8 border-l border-gray-200">
                    {comment.replies?.map((reply) => (
                        <Comment key={reply._id} comment={reply} onReply={onReply} onLike={onLike} onDislike={onDislike} />
                    ))}
                </div>
            </div>
        </div>
    )
}

// ✅ Comment Section (Main Component)
export default function CommentSection() {
    const params = useParams();
    const slug = params.slug;

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch comments from API
    useEffect(() => {
        if (slug) {
            fetch(`${BASE_URL}/api/blog/${slug}/comments`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        setComments(data.data || [])
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [slug])

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    // Add new comment
    const handleAddComment = async () => {
        if (!captchaToken) {
            alert("Please complete the reCAPTCHA verification before posting.");
            return;
        }

        if (newComment.trim()) {
            const res = await fetch(`${BASE_URL}/api/blog/${slug}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: "Current User", // Replace with logged-in user
                    content: newComment,
                    captchaToken,
                }),
            })

            const savedComment = await res.json();

            if (savedComment.status === "success") {
                setComments([savedComment.data, ...comments])
                setNewComment("")
                setCaptchaToken(null); // Reset captcha
            } else {
                alert(`Failed to post comment: ${savedComment.message || 'Please try again.'}`);
            }
        }
    }

    // Add reply
    const handleAddReply = async (commentId, text) => {
        const response = await fetch(`${BASE_URL}/api/blog/${slug}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: "Current User", // Replace with logged-in user
                content: text,
                parentComment: commentId,
            }),
        })

        if (response.ok) {
            const newReply = await response.json();

            // Function to recursively add the reply to the correct comment in the state
            const addReplyToState = (commentsList) => {
                return commentsList.map(comment => {
                    if (comment._id === commentId) {
                        // Add the new reply to the beginning of the replies array
                        return { ...comment, replies: [newReply.data, ...(comment.replies || [])] };
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        return { ...comment, replies: addReplyToState(comment.replies) };
                    }
                    return comment;
                });
            };

            setComments(prevComments => addReplyToState(prevComments));
        }
    }

    const handleLike = async (commentId) => {
        const userId = getUserId();
        if (!userId) return;

        // --- Optimistic Update ---
        // 1. Save the current state in case we need to revert.
        const originalComments = JSON.parse(JSON.stringify(comments));

        // 2. Update the UI immediately.
        const optimisticallyUpdateState = (commentsList) => {
            return commentsList.map(comment => {
                if (comment._id === commentId) {
                    const hasLiked = comment.likedBy.includes(userId);
                    const newLikedBy = hasLiked
                        ? comment.likedBy.filter(id => id !== userId) // Unlike
                        : [...comment.likedBy, userId]; // Like
                    const newDislikedBy = comment.dislikedBy.filter(id => id !== userId); // Always remove from dislikes
                    return { ...comment, likedBy: newLikedBy, dislikedBy: newDislikedBy };
                }
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: optimisticallyUpdateState(comment.replies) };
                }
                return comment;
            });
        };
        setComments(prevComments => optimisticallyUpdateState(prevComments));

        // 3. Make the API call in the background.
        try {
            const response = await fetch(`${BASE_URL}/api/blog/comments/${commentId}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                // If the API call fails, revert the state.
                throw new Error("Failed to update like on the server.");
            }
        } catch (error) {
            console.error("Optimistic update failed:", error);
            // On error, revert to the original state.
            setComments(originalComments);
        }
    };

    const handleDislike = async (commentId) => {
        const userId = getUserId();
        if (!userId) return;

        // --- Optimistic Update ---
        const originalComments = JSON.parse(JSON.stringify(comments));

        const optimisticallyUpdateState = (commentsList) => {
            return commentsList.map(comment => {
                if (comment._id === commentId) {
                    const hasDisliked = comment.dislikedBy.includes(userId);
                    const newDislikedBy = hasDisliked
                        ? comment.dislikedBy.filter(id => id !== userId) // Remove dislike
                        : [...comment.dislikedBy, userId]; // Add dislike
                    const newLikedBy = comment.likedBy.filter(id => id !== userId); // Always remove from likes
                    return { ...comment, likedBy: newLikedBy, dislikedBy: newDislikedBy };
                }
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: optimisticallyUpdateState(comment.replies) };
                }
                return comment;
            });
        };
        setComments(prevComments => optimisticallyUpdateState(prevComments));

        try {
            const response = await fetch(`${BASE_URL}/api/blog/comments/${commentId}/dislike`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update dislike on the server.");
            }
        } catch (error) {
            console.error("Optimistic update failed:", error);
            setComments(originalComments);
        }
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif font-black text-gray-900 mb-8">
                    Join the Conversation
                </h2>

                {/* New Comment Form */}
                <Card className="mb-12 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex space-x-4">
                            <Avatar>
                                <AvatarImage src="/images/avatar/avatar-1.jpg" alt="Current User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full mb-2"
                                />

                                {RECAPTCHA_SITE_KEY ? (
                                    <ReCAPTCHA
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={handleCaptchaChange}
                                        className="mb-4"
                                    />
                                ) : (
                                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">
                                        reCAPTCHA is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.
                                    </div>
                                )}
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAddComment}
                                        className="bg-cyan-600 hover:bg-cyan-700"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Comment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-8">
                    {loading ? (
                        <p className="text-gray-500">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <Comment key={comment._id} comment={comment} onReply={handleAddReply} onLike={handleLike} onDislike={handleDislike} />
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </section>
    )
}
