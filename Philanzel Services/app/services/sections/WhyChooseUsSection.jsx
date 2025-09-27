"use client"
import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function WhyChooseUsSection({ section }) {
    const [data, setData] = useState(section || null)
    const [loading, setLoading] = useState(!section)

    useEffect(() => {
        if (!section) {
            fetch(`${BASE_URL}/api/partner/why-choose-philanzel/public`)
                .then(res => res.json())
                .then(result => {
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setData(result.data[0])
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [section])

    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>
    if (!data) return null
    console.log('WhyChooseUsSection data:', data);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img src={data.image || "/images/pms-img-1.jpg"} alt="Why Choose Us" className="rounded-lg shadow-xl" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{data.heading || data.title || "Why Choose Us"}</h2>
                        <div className="text-lg text-gray-600 mb-8 font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: data.description }} />
                        <ul className="space-y-4">
                            {(() => {
                                const pointsArr = data.points || data.items || data.list || [];
                                if (Array.isArray(pointsArr) && pointsArr.length > 0) {
                                    return pointsArr.map((point, i) => {
                                        // If point is a string, render directly
                                        if (typeof point === "string") {
                                            return (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle className="text-cyan-600 mr-2 mt-1" size={20} />
                                                    <span className="text-gray-700">{point}</span>
                                                </li>
                                            );
                                        }
                                        // If point is an object, use fallback logic
                                        return (
                                            <li key={i} className="flex items-start">
                                                <CheckCircle className="text-cyan-600 mr-2 mt-1" size={20} />
                                                <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: point.description || point.text || point.title || point.heading || "" }} />
                                            </li>
                                        );
                                    });
                                }
                                return <div className="text-gray-500">No points found.</div>;
                            })()}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
