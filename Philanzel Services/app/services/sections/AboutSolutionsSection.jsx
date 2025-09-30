"use client"
import { useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function AboutSolutionsSection({ section }) {
    // Accepts section prop, but can fallback to API if needed
    const [data, setData] = useState(section || null);
    const [loading, setLoading] = useState(!section);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!section) {
            // fallback: fetch from API if not provided
            fetch(`${BASE_URL}/api/about-us`)
                .then(res => {
                    if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
                    return res.json(); // This parses the response body as JSON
                })
                .then(result => {
                    if (result.status === 'success' && result.data && result.data.length > 0) {
                        setData(result.data[0]);
                    } else {
                        throw new Error(result.message || 'Failed to fetch data');
                    }
                })
                .catch(err => {
                    console.error("Error fetching AboutSolutionsSection data:", err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [section]);

    if (loading) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-gray-600">Loading...</p></div></section>;
    if (error) return <section className="py-20 bg-white"><div className="max-w-7xl mx-auto px-4"><p className="text-red-500">Error: {error}</p></div></section>;
    if (!data) return null; // Don't render anything if there's no data and no error
    console.log('AboutSolutionsSection data:', data);
    // The image URL is the first item in the 'images' array.
    // It might be a full URL or a relative path.
    const imageUrl = data.images?.[0] || "";
    const fullImageUrl = imageUrl && !imageUrl.startsWith('http') ? `${BASE_URL}${imageUrl}` : imageUrl;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                            src={fullImageUrl || "/images/pms-img-1.jpg"} // Fallback to a default image
                            alt={data.heading?.[0] || data.title || "About Us"}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{data.heading?.[0] || data.title || "Our Story"}</h2>
                        <div className="text-lg text-gray-600 mb-10" dangerouslySetInnerHTML={{ __html: data.description?.[0] || data.text || "" }} />
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
