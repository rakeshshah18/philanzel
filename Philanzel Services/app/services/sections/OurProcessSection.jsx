"use client"
import { useEffect, useState } from "react"
import { DollarSign, Users, Globe, Building } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function OurProcessSection({ section }) {
    const [data, setData] = useState(section || null)
    const [loading, setLoading] = useState(!section)

    useEffect(() => {
        if (!section) {
            fetch(`${BASE_URL}/api/partner/our-process/public`)
                .then(res => res.json())
                .then(result => {
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        setData(result.data[0])
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [section])

    const stripHtml = (html) => {
        if (!html) return ''
        return String(html)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
    }

    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>
    if (!data) return null
    console.log('OurProcessSection data:', data);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="w-fit mx-auto text-sm font-semibold text-cyan-600 tracking-wide mb-2 text-center border-2 border-cyan-100 bg-cyan-50 px-4 py-1 rounded">
                    OUR PROCESS
                </p>
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">{data.heading || data.title || "Our Process"}</h2>
                <p className="text-lg text-gray-600 mb-10 text-center">{stripHtml(data.description)}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(() => {
                        const stepsArr = data.steps || data.process || data.items || data.list || [];
                        if (Array.isArray(stepsArr) && stepsArr.length > 0) {
                            return stepsArr.map((step, i) => (
                                <div key={i} className="bg-cyan-50 rounded-lg shadow p-8 flex flex-col items-center text-center">
                                    <div className="mb-4 text-cyan-600">
                                        {step.staticIcon === "DollarSign" && <DollarSign size={36} />}
                                        {step.staticIcon === "Users" && <Users size={36} />}
                                        {step.staticIcon === "Globe" && <Globe size={36} />}
                                        {step.staticIcon === "Building" && <Building size={36} />}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{step.name || step.title || step.text || step.heading}</h4>
                                    <p className="text-gray-600 text-sm">{step.description || step.title || step.text || step.heading}</p>
                                </div>
                            ));
                        }
                        // Fallback: use subheading, subdescription, images arrays
                        const subheadingArr = data.subheading || [];
                        const subdescriptionArr = data.subdescription || [];
                        const imagesArr = data.images || [];
                        const count = Math.max(subheadingArr.length, subdescriptionArr.length, imagesArr.length);
                        if (count > 0) {
                            return Array.from({ length: count }).map((_, i) => (
                                <div key={i} className="bg-cyan-50 rounded-lg shadow p-8 flex flex-col items-center text-center">
                                    {imagesArr[i] && (
                                        <img src={imagesArr[i]} alt={subheadingArr[i] || `Step ${i + 1}`} className="mb-4 rounded-lg w-20 h-20 object-cover" />
                                    )}
                                    <h4 className="font-bold text-lg mb-2">{subheadingArr[i] || `Step ${i + 1}`}</h4>
                                    <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: subdescriptionArr[i] || "" }} />
                                </div>
                            ));
                        }
                        return <div className="text-gray-500 col-span-4">No steps found.</div>;
                    })()}
                </div>
            </div>
        </section>
    )
}
