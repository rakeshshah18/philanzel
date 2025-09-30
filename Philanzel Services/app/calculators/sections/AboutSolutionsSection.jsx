"use client"
import { useEffect, useState } from 'react';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export default function AboutSolutionsSection({ section }) {
    const [data, setData] = useState(section || null);
    const [loading, setLoading] = useState(!section);
    useEffect(() => {
        if (!section) {
            fetch(`${BASE_URL}/api/about-us`)
                .then(res => res.json())
                .then(result => {
                    if (result.status === 'success' && result.data && result.data.length > 0) {
                        setData(result.data[0]);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [section]);

    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>;
    if (!data) return null;
    const stripHtml = html => {
        if (typeof html !== 'string') return '';
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    };
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                            src={data.image?.url ? `${BASE_URL}${data.image.url}` : "/images/pms-img-1.jpg"}
                            alt={data.image?.altText || "About Us"}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{data.heading || data.title || "Our Story"}</h2>
                        <div className="text-lg text-gray-600 mb-10 text-center" dangerouslySetInnerHTML={{ __html: data.description || data.text || data.title || "" }} />
                        {data.button && (
                            <div className="flex">
                                <a href={data.button.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                                    {data.button.text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
