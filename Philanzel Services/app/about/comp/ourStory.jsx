'use client'

import { useState, useEffect } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function OurStory() {
    const [aboutData, setAboutData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/about-us`)
                if (!response.ok) {
                    throw new Error('Failed to fetch about data')
                }
                const result = await response.json()
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    setAboutData(result.data[0])
                }
            } catch (err) {
                setError(err.message)
                console.error('Error fetching about data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchAboutData()
    }, [])

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (error || !aboutData) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600">Error loading about content</p>
                    </div>
                </div>
            </section>
        )
    }

    // Function to strip HTML tags for clean text display
    const stripHtml = (html) => {
        if (!html) return ''
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                            src={aboutData.image?.url ? `${BASE_URL}${aboutData.image.url}` : "/images/pms-img-1.jpg"}
                            alt={aboutData.image?.altText || "About Us"}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">
                            {aboutData.heading || "Our Story"}
                        </h2>
                        <div className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
                            {stripHtml(aboutData.description)}
                        </div>
                        {aboutData.button && (
                            <div className="flex">
                                <a 
                                    href={aboutData.button.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {aboutData.button.text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}