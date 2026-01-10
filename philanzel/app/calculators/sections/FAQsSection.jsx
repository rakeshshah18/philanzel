"use client"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
export default function FAQsSection({ section }) {
    const [data, setData] = useState(section || null)
    const [loading, setLoading] = useState(!section)
    const [openFAQ, setOpenFAQ] = useState(null)
    useEffect(() => {
        if (!section) {
            fetch(`${BASE_URL}/api/partner-faqs/public`)
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
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">{data.heading || data.title || "FAQs"}</h2>
                <div className="max-w-2xl mx-auto">
                    {(data.faqs || []).map((faq, i) => (
                        <div key={faq._id || i} className="mb-6 border-b pb-4">
                            <button className="flex items-center w-full text-left text-lg font-semibold text-cyan-700 focus:outline-none" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                                <span className="faq-question no-underline" style={{ textDecoration: 'none' }} dangerouslySetInnerHTML={{ __html: faq.question }} />
                                {openFAQ === i ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" />}
                            </button>
                            {openFAQ === i && (
                                <div className="mt-2 text-gray-600" dangerouslySetInnerHTML={{ __html: faq.description }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
