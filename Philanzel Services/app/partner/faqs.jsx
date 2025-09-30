"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQsSection() {
    const [faqsData, setFaqsData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [openFAQ, setOpenFAQ] = useState(null)
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    useEffect(() => {
        const fetchFAQsData = async () => {
            try {
                setIsLoading(true)
                
                const response = await fetch(`${BASE_URL}/api/partner-faqs/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setFaqsData(result.data[0])
                    } else {
                        setFaqsData(getStaticFAQsData())
                    }
                } else {
                    console.log('Using static data as API request failed')
                    setFaqsData(getStaticFAQsData())
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
                setFaqsData(getStaticFAQsData())
            } finally {
                setIsLoading(false)
            }
        }

        fetchFAQsData()
    }, [])

    const getStaticFAQsData = () => ({
        heading: "Frequently Asked Questions",
        description: "<p>Find answers to the most common questions and get all the information you need to start your journey with Philanzel.</p>",
        faqs: [
            {
                question: "<p>What is a POSP?</p>",
                answer: "<p>A POSP (Point of Sales Person) is a certified individual authorized to sell insurance products.</p>",
                _id: "faq1"
            },
            {
                question: "<p>Who is eligible to join?</p>",
                answer: "<p>Anyone above 18 years old with a <strong>minimum</strong> qualification of 10th standard can apply.</p>",
                _id: "faq2"
            },
            {
                question: "<p>Are there any fees?</p>",
                answer: "<p>No. Joining Philanzel as a POSP partner is completely free.</p>",
                _id: "faq3"
            },
            {
                question: "<p>Can I do this part-time?</p>",
                answer: "<p>Yes! You can work full-time or part-time based on your availability.</p>",
                _id: "faq4"
            },
            {
                question: "<p>Will I get training?</p>",
                answer: "<p>Yes, we provide complete online training to help you get certified and start selling.</p>",
                _id: "faq5"
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
    const toggleFAQ = (faqId) => {
        setOpenFAQ(openFAQ === faqId ? null : faqId)
    }

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading FAQs...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-cyan-600 tracking-wide mb-2">FAQs</p>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        {faqsData?.heading || "Frequently Asked Questions"}
                    </h2>
                    <div className="text-md text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed">
                        {renderHTMLContent(faqsData?.description)}
                    </div>
                </div>
                <div className="space-y-4">
                    {faqsData?.faqs?.map((faq, index) => (
                        <div 
                            key={faq._id || index} 
                            className="border border-gray-300 rounded-lg overflow-hidden hover:border-cyan-300 transition-colors duration-200"
                        >
                            <button
                                onClick={() => toggleFAQ(faq._id || index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex-1 pr-4">
                                    <div className="text-lg font-semibold text-gray-900 prose prose-lg max-w-none">
                                        {renderHTMLContent(faq.question)}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {openFAQ === (faq._id || index) ? (
                                        <ChevronUp className="h-5 w-5 text-cyan-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </button>
                            {openFAQ === (faq._id || index) && (
                                <div className="px-6 pb-4 border-t border-gray-100">
                                    <div className="pt-4 text-gray-600 font-sans leading-relaxed prose prose-lg max-w-none">
                                        {renderHTMLContent(faq.answer)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
