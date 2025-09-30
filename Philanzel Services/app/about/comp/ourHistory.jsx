'use client'
import { useState, useEffect } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
export function OurHistory() {
    const [journeyData, setJourneyData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchJourneyData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/our-journey`)
                if (!response.ok) {
                    throw new Error('Failed to fetch journey data')
                }
                const result = await response.json()
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    setJourneyData(result.data[0])
                }
            } catch (err) {
                setError(err.message)
                console.error('Error fetching journey data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchJourneyData()
    }, [])
    const stripHtml = (html) => {
        if (!html) return ''
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    }
    if (loading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </section>
        )
    }
    if (error || !journeyData) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600">Error loading journey content</p>
                    </div>
                </div>
            </section>
        )
    }
    const sortedCards = journeyData.cards ? [...journeyData.cards].sort((a, b) => a.order - b.order) : []
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">OUR HISTORY</p>
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                        {journeyData.heading || "Our Journey So Far"}
                    </h2>
                    <div className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                        {stripHtml(journeyData.description) || "Explore the milestones that have shaped our growth and commitment to financial empowerment."}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-8 left-0 w-full h-4 bg-cyan-400 hidden md:block rounded-2xl"></div>
                    <div className="overflow-x-auto max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '1050px', margin: '0 auto' }}>
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className="flex gap-8 min-w-max pb-4">
                            {sortedCards.map((card, index) => (
                                <div key={card._id} className="relative flex-shrink-0" style={{ width: '270px' }}>
                                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-600 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                                    <div className="bg-cyan-500 text-white p-6 rounded-lg shadow-lg mt-16 md:mt-20 h-58 flex flex-col items-center text-center">
                                        <div className="text-lg font-bold mb-2">{card.year}</div>
                                        <h3 className="text-xl font-bold mb-3">{card.heading}</h3>
                                        <div className="w-12 h-0.5 bg-white mb-4"></div>
                                        <p className="text-sm leading-relaxed flex-1">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {sortedCards.length > 3 && (
                        <div className="flex justify-center mt-4">
                            <p className="text-sm text-gray-500">← Scroll to see more milestones →</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}