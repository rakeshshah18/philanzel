"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users, Globe, Building } from "lucide-react"

export default function OurProcessSection() {
    const [processData, setProcessData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Define the backend base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Fetch process data from API
    useEffect(() => {
        const fetchProcessData = async () => {
            try {
                setIsLoading(true)
                
                const response = await fetch(`${BASE_URL}/api/partner/our-process/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setProcessData(result.data[0])
                        console.log('Loaded process data:', result.data[0])
                    } else {
                        console.log('Using static data as API response structure is unexpected:', result)
                        setProcessData(getStaticProcessData())
                    }
                } else {
                    console.log('Using static data as API request failed')
                    setProcessData(getStaticProcessData())
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
                setProcessData(getStaticProcessData())
            } finally {
                setIsLoading(false)
            }
        }

        fetchProcessData()
    }, [])

    // Static fallback data
    const getStaticProcessData = () => ({
        heading: "Why Partner With Philanzel?",
        description: "Join forces with a trusted leader in financial services and unlock new opportunities for growth and success.",
        steps: [
            {
                name: "Attractive Returns",
                heading: "Step 1",
                description: "Competitive commission structures and revenue sharing models that reward performance.",
                icon: null,
                staticIcon: "DollarSign",
                color: "cyan"
            },
            {
                name: "Dedicated Support",
                heading: "Step 2", 
                description: "Personal relationship managers and comprehensive training programs for your success.",
                icon: null,
                staticIcon: "Users",
                color: "amber"
            },
            {
                name: "Market Reach",
                heading: "Step 3",
                description: "Access to our extensive client base and proven marketing strategies for faster growth.",
                icon: null,
                staticIcon: "Globe",
                color: "green"
            },
            {
                name: "Brand Association",
                heading: "Step 4",
                description: "Leverage our established brand reputation and industry credibility for your business.",
                icon: null,
                staticIcon: "Building",
                color: "purple"
            }
        ]
    })

    // Get appropriate icon component
    const getIconComponent = (step, index) => {
        if (step.icon) {
            return (
                <img
                    src={`${BASE_URL}${step.icon}`}
                    alt={step.name || 'Process step'}
                    className="h-25 w-30 object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none'
                    }}
                />
            )
        }

        // Fallback to static icons
        const iconColors = ['cyan', 'amber', 'green', 'purple']
        const color = iconColors[index % iconColors.length]
        const IconComponents = { DollarSign, Users, Globe, Building }
        const IconComponent = IconComponents[step.staticIcon] || DollarSign

        return <IconComponent className={`h-12 w-12 text-${color}-600`} />
    }

    // Get background color for icon container
    const getBackgroundColor = (step, index) => {
        if (step.color) return `bg-${step.color}-100`
        
        const colors = ['white', 'white', 'white', 'white']
        const color = colors[index % colors.length]
        return `bg-${color}-100`
    }

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading process information...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">OUR PROCESS</p>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        {processData?.heading || "Why Partner With Philanzel?"}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                        {processData?.description || "Join forces with a trusted leader in financial services and unlock new opportunities for growth and success."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processData?.steps?.map((step, index) => (
                        <div key={step._id || index} className="text-center">
                            <div className={`h-30 w-25 ${getBackgroundColor(step, index)} rounded flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 cursor-pointer`}>
                                {getIconComponent(step, index)}
                            </div>
                            {step.heading && (
                                <div className="text-sm font-semibold text-cyan-600 mb-1">
                                    {step.heading}
                                </div>
                            )}
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                                {step.name}
                            </h3>
                            <p className="text-gray-600 font-sans text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}