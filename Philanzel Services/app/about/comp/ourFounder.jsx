'use client'

import { useState, useEffect } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function OurFounder() {
    const [founderData, setFounderData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFounderData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/about/our-founder/`)
                if (!response.ok) {
                    throw new Error('Failed to fetch founder data')
                }
                const result = await response.json()
                if (result.success && result.data && result.data.length > 0) {
                    setFounderData(result.data[0])
                }
            } catch (err) {
                setError(err.message)
                console.error('Error fetching founder data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchFounderData()
    }, [])

    // Helper function to strip HTML tags
    const stripHtmlTags = (html) => {
        if (!html) return ''
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || div.innerText || ''
    }

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xl text-gray-600">Loading founder information...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (error || !founderData) {
        // Fallback static content
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">OUR FOUNDER</p>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                            Rajdeep Singh
                        </h2>
                        <p className="text-xl text-gray-600 font-sans">
                            Founder & CEO
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                Rajdeep Singh – Founder & CEO
                            </h3>
                            <div className="space-y-4 text-gray-600 font-sans leading-relaxed">
                                <p>
                                    Rajdeep Singh brings over 15 years of rich experience in the financial services industry. He has held senior positions in top-tier firms like Bajaj Capital and HDFC Life, gaining insights into investment, insurance, equity broking, and client-focused planning.
                                </p>
                                <p>
                                    A Certified Mutual Fund Distributor (AMFI) and Recognized Insurance Advisor (IRDAI), Rajdeep saw a gap in genuine, accessible financial guidance for individuals. That insight inspired the birth of Philanzel.
                                </p>
                                <p className="italic text-cyan-700 font-medium">
                                    "Our mission is to educate and empower individuals to achieve financial freedom, confidently and on time."
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src="/images/founder-rajdeep.jpg"
                                alt="Rajdeep Singh - Founder & CEO"
                                className="rounded-lg shadow-xl max-w-md w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">OUR FOUNDER</p>
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                        {founderData.name || 'Rajdeep Singh'}
                    </h2>
                    <p className="text-xl text-gray-600 font-sans">
                        {founderData.designation || 'Founder & CEO'}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
                        <div className="space-y-4 text-gray-600 font-sans leading-relaxed">
                            {founderData.description ? (
                                <div dangerouslySetInnerHTML={{ __html: founderData.description }} />
                            ) : (
                                <>
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                        Rajdeep Singh – Founder & CEO
                                    </h3>
                                    <p>
                                        Rajdeep Singh brings over 15 years of rich experience in the financial services industry. He has held senior positions in top-tier firms like Bajaj Capital and HDFC Life, gaining insights into investment, insurance, equity broking, and client-focused planning.
                                    </p>
                                    <p>
                                        A Certified Mutual Fund Distributor (AMFI) and Recognized Insurance Advisor (IRDAI), Rajdeep saw a gap in genuine, accessible financial guidance for individuals. That insight inspired the birth of Philanzel.
                                    </p>
                                    <p className="italic text-cyan-700 font-medium">
                                        "Our mission is to educate and empower individuals to achieve financial freedom, confidently and on time."
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img
                            src={founderData.image ? founderData.image.url : "/images/founder-rajdeep.jpg"}
                            alt={founderData.image?.altText || `${founderData.name || 'Rajdeep Singh'} - ${founderData.designation || 'Founder & CEO'}`}
                            className="rounded-lg shadow-xl max-w-md w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}