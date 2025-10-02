"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const initialComments = [
    {
        id: 1,
        author: "Alex Johnson",
        avatar: "/images/avatar/avatar-2.jpg",
        date: "2024-05-20T10:00:00Z",
        text: "Great article! Really insightful analysis of the current market trends. I've been looking for a clear explanation like this.",
        likes: 15,
        dislikes: 1,
        replies: [
            {
                id: 3,
                author: "Samantha Lee",
                avatar: "/images/avatar/avatar-3.jpg",
                date: "2024-05-20T11:30:00Z",
                text: "I agree! The section on emerging markets was particularly helpful.",
                likes: 4,
                dislikes: 0,
                replies: [],
            },
        ],
    },
    {
        id: 2,
        author: "Maria Garcia",
        avatar: "/images/avatar/avatar-4.jpg",
        date: "2024-05-21T14:20:00Z",
        text: "I have a slightly different perspective on the risk assessment part. Has the author considered the impact of recent regulatory changes?",
        likes: 8,
        dislikes: 3,
        replies: [],
    },
]

function Comment({ comment, onReply }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState("")

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText)
            setReplyText("")
            setIsReplying(false)
        }
    }

    return (
        <div className="flex space-x-4">
            <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-800">{comment.author}</div>
                    <div className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                </div>
                <p className="text-gray-700 mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <button className="flex items-center space-x-1 hover:text-cyan-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-red-600">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{comment.dislikes}</span>
                    </button>
                    <button onClick={() => setIsReplying(!isReplying)} className="flex items-center space-x-1 hover:text-cyan-600">
                        <MessageSquare className="h-4 w-4" />
                        <span>Reply</span>
                    </button>
                </div>

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
                                <Button size="sm" onClick={handleReplySubmit} className="bg-cyan-600 hover:bg-cyan-700">
                                    Post Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 space-y-4 pl-8 border-l border-gray-200">
                    {comment.replies?.map((reply) => (
                        <Comment key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function CommentSection() {
    const [comments, setComments] = useState(initialComments)
    const [newComment, setNewComment] = useState("")

    const handleAddComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: Date.now(),
                author: "Current User", // Replace with actual user data
                avatar: "/images/avatar/avatar-1.jpg",
                date: new Date().toISOString(),
                text: newComment,
                likes: 0,
                dislikes: 0,
                replies: [],
            }
            setComments([newCommentObj, ...comments])
            setNewComment("")
        }
    }

    const handleAddReply = (commentId, text) => {
        const newReply = {
            id: Date.now(),
            author: "Current User",
            avatar: "/images/avatar/avatar-1.jpg",
            date: new Date().toISOString(),
            text,
            likes: 0,
            dislikes: 0,
            replies: [],
        }

        const addReplyToComment = (commentsList) => {
            return commentsList.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, replies: [newReply, ...comment.replies] }
                }
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: addReplyToComment(comment.replies) }
                }
                return comment
            })
        }

        setComments(addReplyToComment(comments))
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif font-black text-gray-900 mb-8">Join the Conversation</h2>

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
                                <div className="flex justify-end">
                                    <Button onClick={handleAddComment} className="bg-cyan-600 hover:bg-cyan-700">
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
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} onReply={handleAddReply} />
                    ))}
                </div>
            </div>
        </section>
    )
}
