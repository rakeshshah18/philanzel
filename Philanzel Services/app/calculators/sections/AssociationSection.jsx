"use client"
import { useEffect, useState } from "react"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
export default function AssociationSection({ section }) {
    const [associations, setAssociations] = useState(section?.associations || [])
    const [loading, setLoading] = useState(!section)
    useEffect(() => {
        if (!section) {
            setAssociations(getStaticAssociations())
            fetch(`${BASE_URL}/api/partner/public`)
                .then(res => res.json())
                .then(result => {
                    if (result.data && result.data.length > 0) {
                        const allImages = result.data.map((item, index) => ({
                            id: item._id || `association-${index}`,
                            name: `Association ${index + 1}`,
                            image: `${BASE_URL}${item.url}`,
                            alt: item.alt || `Association ${index + 1}`
                        }))
                        if (allImages.length > 0) setAssociations(allImages)
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [section])
    const getStaticAssociations = () => [
        { id: 1, name: "IRDAI", image: "https://via.placeholder.com/150x80/0f172a/ffffff?text=IRDAI" },
        { id: 2, name: "IRDA", image: "https://via.placeholder.com/150x80/1e40af/ffffff?text=IRDA" },
    ]
    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>
    if (!associations.length) return null
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">Our Partners</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {associations.map(assoc => (
                        <div key={assoc.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                            <img src={assoc.image} alt={assoc.alt || assoc.name} className="h-20 object-contain mb-2" />
                            <span className="text-gray-700 font-semibold text-sm mt-1">{assoc.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
