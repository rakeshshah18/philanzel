"use client"
import { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
export default function WhyChooseUsSection() {
    const [chooseUsData, setChooseUsData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    useEffect(() => {
        const fetchChooseUsData = async () => {
            try {
                setIsLoading(true)
                
                const response = await fetch(`${BASE_URL}/api/partner/why-choose-philanzel/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setChooseUsData(result.data[0])
                    } else {
                        setChooseUsData(getStaticChooseUsData())
                    }
                } else {
                    console.log('Using static data as API request failed')
                    setChooseUsData(getStaticChooseUsData())
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
                setChooseUsData(getStaticChooseUsData())
            } finally {
                setIsLoading(false)
            }
        }

        fetchChooseUsData()
    }, [])
    const getStaticChooseUsData = () => ({
        heading: "Why Choose Philanzel?",
        description: "<p>Philanzel gives you the <strong>tools</strong>, <em>training</em>, and support you need to start strong and succeed as a POSP Partner—without any upfront investment.</p>",
        image: "https://via.placeholder.com/600x400/0f172a/ffffff?text=Why+Choose+Philanzel",
        points: [
            {
                description: "Philanzel offers reliable support and a strong foundation to kickstart your insurance career."
            },
            {
                description: "Get started without any upfront cost or financial barrier."
            },
            {
                description: "Access structured training and expert mentorship every step of the way."
            },
            {
                description: "Sell a variety of insurance products across health, life, and general insurance."
            },
            {
                description: "Earn attractive commissions and incentives for your performance."
            }
        ]
    })
    const renderHTMLContent = (htmlString) => {
        if (!htmlString) return null
        const cleanHTML = htmlString
            .replace(/\\u003C/g, '<')
            .replace(/\\u003E/g, '>')
            .replace(/&amp;/g, '&')
        
        return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
    }

    if (isLoading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading why choose us information...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-8 text-center">WHY CHOOSE US?</p>
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2">
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={chooseUsData?.image ? `${BASE_URL}/uploads/images/${chooseUsData.image}` : 'https://via.placeholder.com/600x400/6b7280/ffffff?text=Why+Choose+Us'}
                                alt={chooseUsData?.heading || 'Why Choose Philanzel'}
                                className="w-full h-64 sm:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x400/6b7280/ffffff?text=Error'
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                                    {chooseUsData?.heading || "Why Choose Philanzel?"}
                                </h2>
                                <div className="text-lg text-gray-600 font-sans leading-relaxed prose prose-lg max-w-none">
                                    {renderHTMLContent(chooseUsData?.description)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {chooseUsData?.points?.map((point, index) => (
                                    <div key={point._id || index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <p className="text-gray-700 font-sans leading-relaxed">
                                            {point.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
