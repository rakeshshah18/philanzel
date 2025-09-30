'use client'
import { CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
export function OurApproach() {
    const [approachData, setApproachData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchApproachData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/why-choose-us`)
                if (!response.ok) {
                    throw new Error('Failed to fetch approach data')
                }
                const result = await response.json()
                if (result.success && result.data && result.data.length > 0) {
                    setApproachData(result.data[0])
                }
            } catch (err) {
                setError(err.message)
                console.error('Error fetching approach data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchApproachData()
    }, [])
    const stripHtmlTags = (html) => {
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent || div.innerText || ''
    }
    if (loading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xl text-gray-600">Loading our approach...</p>
                    </div>
                </div>
            </section>
        )
    }
    if (error || !approachData) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xl text-red-600">Failed to load approach data</p>
                    </div>
                </div>
            </section>
        )
    }
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">WHY CHOOSE US?</p>
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                        {approachData.heading || 'Our Investment Approach'}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                        {stripHtmlTags(approachData.description) || 'A disciplined, research-driven methodology that has delivered consistent results across market cycles.'}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img
                            src={approachData.image ? `${BASE_URL}${approachData.image.url}` : "/images/pms-img-1.jpg"}
                            alt={approachData.image ? approachData.image.originalName : "Investment research and analysis"}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div>
                        <div className="space-y-6">
                            {approachData.points && approachData.points.length > 0 ? (
                                approachData.points.map((point, index) => (
                                    <div key={point._id || index} className="flex items-start space-x-4">
                                        <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-600 font-sans">
                                                {point.text}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex items-start space-x-4">
                                        <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-600 font-sans">
                                                Our investment decisions are backed by comprehensive fundamental analysis, technical research, and
                                                macroeconomic insights.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-600 font-sans">
                                                We focus on generating superior risk-adjusted returns rather than chasing short-term performance.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-600 font-sans">
                                                Continuous monitoring and rebalancing to adapt to changing market conditions and opportunities.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <CheckCircle className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-gray-600 font-sans">
                                                We invest with a long-term horizon, focusing on sustainable wealth creation over market cycles.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}