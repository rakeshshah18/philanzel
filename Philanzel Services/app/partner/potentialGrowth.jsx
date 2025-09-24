"use client"

import { useState, useEffect } from "react"

export default function PotentialGrowthSection() {
    const [growthData, setGrowthData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Define the backend base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Fetch potential growth data from API
    useEffect(() => {
        const fetchGrowthData = async () => {
            try {
                setIsLoading(true)
                
                const response = await fetch(`${BASE_URL}/api/partner/potential-growth/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (Array.isArray(result) && result.length > 0) {
                        setGrowthData(result[0])
                        console.log('Loaded potential growth data:', result[0])
                    } else {
                        console.log('Using static data as API response structure is unexpected:', result)
                        setGrowthData(getStaticGrowthData())
                    }
                } else {
                    console.log('Using static data as API request failed')
                    setGrowthData(getStaticGrowthData())
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
                setGrowthData(getStaticGrowthData())
            } finally {
                setIsLoading(false)
            }
        }

        fetchGrowthData()
    }, [])

    // Static fallback data
    const getStaticGrowthData = () => ({
        commonHeading: "Multi-Product Offerings to Expand Your Client Solutions",
        commonDescription: "<p>As a Philanzel POSP Partner, you're not limited to just insurance. You get the advantage of offering a diverse range of financial</p><p>products—enhancing your income potential and helping your clients make smarter financial choices.</p>",
        solutions: [
            {
                heading: "Equity",
                description: "Invest in company shares to benefit from business growth and dividends, giving clients a stake in success.",
                icon: "https://via.placeholder.com/80x80/0f172a/ffffff?text=EQ"
            },
            {
                heading: "Mutual Funds",
                description: "Offer access to professionally managed portfolios that diversify risks and aim for long-term returns.",
                icon: "https://via.placeholder.com/80x80/1e40af/ffffff?text=MF"
            },
            {
                heading: "Insurance",
                description: "Help your clients secure their future with trusted life, health, and general insurance solutions.",
                icon: "https://via.placeholder.com/80x80/dc2626/ffffff?text=INS"
            },
            {
                heading: "Bonds",
                description: "Promote safer investments through government and corporate bonds that offer fixed income and stability.",
                icon: "https://via.placeholder.com/80x80/059669/ffffff?text=BND"
            }
        ]
    })

    // Function to safely render HTML content
    const renderHTMLContent = (htmlString) => {
        if (!htmlString) return null
        
        // Clean and decode HTML entities
        const cleanHTML = htmlString
            .replace(/\\u003C/g, '<')
            .replace(/\\u003E/g, '>')
            .replace(/&amp;/g, '&')
        
        return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
    }

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading growth opportunities...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">Unlock the Potential of Growth</p>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                        {growthData?.commonHeading || "Multi-Product Offerings to Expand Your Client Solutions"}
                    </h2>
                    <div className="text-sm text-gray-600 max-w-4xl mx-auto font-sans leading-relaxed">
                        {renderHTMLContent(growthData?.commonDescription)}
                    </div>
                </div>

                {/* Solutions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {growthData?.solutions?.map((solution, index) => (
                        <div 
                            key={solution._id || index} 
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 hover:border-cyan-300"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                    {solution.icon ? (
                                        <img
                                            src={`${BASE_URL}${solution.icon}`}
                                            alt={solution.heading || 'Solution'}
                                            className="h-12 w-12 object-contain"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/48x48/6b7280/ffffff?text=?'
                                            }}
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {solution.heading?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
                                    {solution.heading}
                                </h3>
                                <p className="text-gray-600 font-sans text-md leading-relaxed">
                                    {solution.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
