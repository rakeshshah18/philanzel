"use client"

import { useState, useEffect } from "react"

export default function EmpowerSection() {
    const [empowerData, setEmpowerData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Define the backend base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Fetch empower data from API
    useEffect(() => {
        const fetchEmpowerData = async () => {
            try {
                setIsLoading(true)
                
                const response = await fetch(`${BASE_URL}/api/partner/empowering-individuals/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setEmpowerData(result.data[0])
                        console.log('Loaded empower data:', result.data[0])
                    } else {
                        console.log('Using static data as API response structure is unexpected:', result)
                        setEmpowerData(getStaticEmpowerData())
                    }
                } else {
                    console.log('Using static data as API request failed')
                    setEmpowerData(getStaticEmpowerData())
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
                setEmpowerData(getStaticEmpowerData())
            } finally {
                setIsLoading(false)
            }
        }

        fetchEmpowerData()
    }, [])

    // Static fallback data
    const getStaticEmpowerData = () => ({
        commonDescription: "<p><strong>Empowering Individuals to Build Successful Insurance & Investment Careers with Zero Barriers</strong></p>",
        content: [
            {
                heading: "Empowering Insurance Entrepreneurs Across India",
                description: "<p>At Philanzel, we believe in creating opportunities for individuals to build meaningful and financially rewarding careers in the insurance industry. As a modern platform focused on flexibility, empowerment, and support, we help aspiring insurance professionals become certified POSP partners with ease.</p><p>From registration to certification and sales, Philanzel provides end-to-end support, training, and access to a wide range of insurance products. Our mission is to make insurance entrepreneurship accessible to everyone—without the need for prior experience or upfront investment.</p><p>Join us and take control of your future, one policy at a time.</p>",
                image: "https://via.placeholder.com/600x400/0f172a/ffffff?text=Empowering+Individuals"
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
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading empowerment information...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Common Description */}
                {empowerData?.commonDescription && (
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">ABOUT PHILANZEL</p>
                        <div className="text-2xl font-serif text-gray-900 max-w-4xl mx-auto">
                            {renderHTMLContent(empowerData.commonDescription)}
                        </div>
                    </div>
                )}

                {/* Content Items */}
                {empowerData?.content?.map((item, index) => (
                    <div key={item._id || index} className="mb-16">
                        <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                            {/* Image */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                    <img
                                        src={item.image ? `${BASE_URL}${item.image}` : 'https://via.placeholder.com/600x400/6b7280/ffffff?text=Empowerment'}
                                        alt={item.heading || 'Empowerment'}
                                        className="w-full h-64 sm:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400/6b7280/ffffff?text=Error'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full lg:w-1/2">
                                <div className="space-y-6">
                                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                                        {item.heading}
                                    </h2>
                                    <div className="text-md text-gray-600 font-sans leading-relaxed prose prose-lg max-w-none">
                                        {renderHTMLContent(item.description)}
                                    </div>
                                    <div>
                                        <button className="bg-cyan-600 text-white px-4 py-2 rounded">Contact Us</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
