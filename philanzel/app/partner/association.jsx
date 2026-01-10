"use client"

import { useState, useEffect } from "react"

export default function AssociationSection() {
    const [associations, setAssociations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    useEffect(() => {
        const fetchAssociations = async () => {
            try {
                setIsLoading(true)
                setAssociations(getStaticAssociations())
                const response = await fetch(`${BASE_URL}/api/partner/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.data && result.data.length > 0) {
                        const allImages = result.data.map((item, index) => ({
                            id: item._id || `association-${index}`,
                            name: `Association ${index + 1}`,
                            image: `${BASE_URL}${item.url}`,
                            alt: item.alt || `Association ${index + 1}`
                        }))
                        
                        if (allImages.length > 0) {
                            setAssociations(allImages)
                        }
                        
                        console.log('Loaded association images:', allImages)
                    } else {
                        console.log('Using static data as API response structure is unexpected:', result)
                    }
                } else {
                    console.log('Using static data as API request failed')
                }
            } catch (error) {
                console.log('Using static data due to API error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAssociations()
    }, [])

    // Static fallback data
    const getStaticAssociations = () => [
        { id: 1, name: "IRDAI", image: "https://via.placeholder.com/150x80/0f172a/ffffff?text=IRDAI" },
        { id: 2, name: "IRDA", image: "https://via.placeholder.com/150x80/1e40af/ffffff?text=IRDA" },
        { id: 3, name: "LIC", image: "https://via.placeholder.com/150x80/dc2626/ffffff?text=LIC" },
        { id: 4, name: "SBI Life", image: "https://via.placeholder.com/150x80/059669/ffffff?text=SBI+Life" },
        { id: 5, name: "HDFC Life", image: "https://via.placeholder.com/150x80/7c2d12/ffffff?text=HDFC+Life" },
        { id: 6, name: "ICICI Prudential", image: "https://via.placeholder.com/150x80/b45309/ffffff?text=ICICI+Pru" },
        { id: 7, name: "Max Life", image: "https://via.placeholder.com/150x80/7c3aed/ffffff?text=Max+Life" },
        { id: 8, name: "Bajaj Allianz", image: "https://via.placeholder.com/150x80/0891b2/ffffff?text=Bajaj+Allianz" },
    ]
    const duplicatedAssociations = [...associations, ...associations]

    if (isLoading) {
        return (
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading associations...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Trusted Associations</h2>
                    <p className="text-gray-600">Partners and certifications that validate our commitment to excellence</p>
                </div>
                <div className="relative overflow-hidden">
                    <div className="flex space-x-8" style={{
                        animation: 'scroll 30s linear infinite',
                        width: 'fit-content'
                    }}>
                        {duplicatedAssociations.map((association, index) => (
                            <div
                                key={`${association.id || association._id}-${index}`}
                                className="flex-shrink-0 bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
                                style={{ minWidth: '200px', height: '120px' }}
                            >
                                <div className="flex items-center justify-center h-full">
                                    <img
                                        src={association.image || association.logo || 'https://via.placeholder.com/150x80/6b7280/ffffff?text=Logo'}
                                        alt={association.alt || association.name || association.title || 'Association'}
                                        className="max-w-full max-h-full object-contain hover:scale-105 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150x80/6b7280/ffffff?text=Error'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </section>
    )
}
