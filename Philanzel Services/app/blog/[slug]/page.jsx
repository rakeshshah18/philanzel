import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import CommentSection from "../CommentSection.jsx"
import CtaSection from "@/app/home/cta-section"
import Footer from "@/app/home/footer"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function fetchBlogData(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/blog/${slug}`, { cache: "no-store" });
    if (!res.ok) return { post: null, allPosts: [] };
    const postData = await res.json();

    const allPostsRes = await fetch(`${BASE_URL}/api/blog/public`, { cache: "no-store" });
    const allPostsData = await allPostsRes.json();

    return { post: postData.data, allPosts: allPostsData.data || [] };
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    return { post: null, allPosts: [] };
  }
}

export default async function BlogPostPage({ params }) {
  const { post, allPosts } = await fetchBlogData(params.slug);

  if (!post) {
    notFound()
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== params.slug && p.category === post.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-8 font-sans px-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          <Badge className="bg-cyan-600 text-white mb-4 ">{post.category}</Badge>

          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8 font-sans leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center space-x-6 text-gray-500 font-sans">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none font-sans
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-ul:text-gray-700 prose-li:mb-2
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </article>


      {/* Navigation */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {currentIndex < allPosts.length - 1 ? (
              <Link
                href={`/blog/${allPosts[currentIndex + 1].slug}`}
                className="flex-1 mr-4"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center text-cyan-600 font-sans mb-2">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Article
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 line-clamp-2">
                      {allPosts[currentIndex + 1].title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="flex-1 mr-4"></div>
            )}

            {currentIndex > 0 ? (
              <Link
                href={`/blog/${allPosts[currentIndex - 1].slug}`}
                className="flex-1 ml-4"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-right">
                    <div className="flex items-center justify-end text-cyan-600 font-sans mb-2">
                      Next Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 line-clamp-2">
                      {allPosts[currentIndex - 1].title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="flex-1 ml-4"></div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-12">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Card
                  key={relatedPost.slug}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={relatedPost.coverImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-cyan-600 text-white">
                      {relatedPost.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 font-sans text-sm leading-relaxed line-clamp-3 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-sans mb-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {relatedPost.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(relatedPost.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {relatedPost.readTime} min
                      </div>
                    </div>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <CommentSection />
      <CtaSection />
      <Footer />
    </div>
  )
}
