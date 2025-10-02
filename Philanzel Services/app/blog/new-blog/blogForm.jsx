"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function BlogForm() {
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")
    const [readTime, setReadTime] = useState("")
    const [tags, setTags] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [isPublished, setIsPublished] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title || !category || !content) {
            alert("Please fill in all required fields")
            return
        }

        const blogData = {
            title,
            category,
            content,
            readTime: readTime ? Number(readTime) : undefined,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            coverImage,
            isPublished,
        }

        try {
            setLoading(true)
            const res = await fetch("http://localhost:8000/api/blog/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogData),
            })

            if (!res.ok) {
                throw new Error("Failed to create blog")
            }

            const data = await res.json()
            console.log("✅ Blog Created:", data)
            alert("Blog created successfully!")

            // Reset form
            setTitle("")
            setCategory("")
            setContent("")
            setReadTime("")
            setTags("")
            setCoverImage("")
            setIsPublished(false)

        } catch (error) {
            console.error("❌ Error creating blog:", error)
            alert("Error creating blog. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif font-bold text-gray-900">
                            Create a New Blog
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blog Title *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter blog title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Technology, Finance, Lifestyle"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blog Content *
                                </label>
                                <Textarea
                                    placeholder="Write your blog content here..."
                                    rows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            {/* Read Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Read Time (minutes)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={readTime}
                                    onChange={(e) => setReadTime(e.target.value)}
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags (comma separated)
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. JavaScript, Node.js, WebDev"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Image URL
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com/cover.jpg"
                                    value={coverImage}
                                    onChange={(e) => setCoverImage(e.target.value)}
                                />
                            </div>

                            {/* Is Published */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPublished"
                                    checked={isPublished}
                                    onCheckedChange={(val) => setIsPublished(val)}
                                />
                                <label
                                    htmlFor="isPublished"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Publish immediately
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                    {loading ? "Publishing..." : "Publish Blog"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
