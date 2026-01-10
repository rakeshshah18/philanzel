"use client"
import { useEffect, useState } from "react"

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export default function AssociationSection({ section }) {
    const [associations, setAssociations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (section) {
            const sectionImages = (section.images || []).map((imgUrl, index) => {
                const imageUrl =
                    imgUrl && !imgUrl.startsWith("http")
                        ? `${BASE_URL}/${imgUrl.replace(/^\/+/, "")}`
                        : imgUrl;

                return {
                    id: section._id ? `${section._id}-${index}` : `assoc-${index}`,
                    name: section.subdescription?.[index] || `Partner ${index + 1}`,
                    image: imageUrl,
                    alt: section.subdescription?.[index] || `Partner Logo ${index + 1}`,
                };
            });

            setAssociations(sectionImages);
            setLoading(false);
        } else {
            fetch(`${BASE_URL}/api/partner/public`)
                .then(res => {
                    if (!res.ok) throw new Error(`Network response was not ok: ${res.statusText}`);
                    return res.json();
                })
                .then(result => {
                    if (result.status === "success" && result.data && result.data.length > 0) {
                        const allImages = result.data.map((item, index) => {
                            const imageUrl =
                                item.url && !item.url.startsWith("http")
                                    ? `${BASE_URL}/${item.url.replace(/^\/+/, "")}`
                                    : item.url;

                            return {
                                id: item._id || `fallback-assoc-${index}`,
                                name: item.name || `Association ${index + 1}`,
                                image: imageUrl,
                                alt: item.alt || `Association ${index + 1}`,
                            };
                        });

                        setAssociations(allImages);
                    } else {
                        throw new Error(result.message || "Failed to fetch association data");
                    }
                })
                .catch(err => {
                    console.error("Error fetching AssociationSection data:", err);
                    setError(err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [section]);

    if (loading)
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </section>
        );

    if (error)
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </section>
        );

    if (!associations.length) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="w-fit mx-auto text-sm font-semibold text-cyan-600 tracking-wide mb-2 text-center border-2 border-cyan-100 bg-cyan-50 px-4 py-1 rounded">
                    {section?.name || "OUR PARTNERS"}
                </p>
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">
                    {section?.title || ""}
                </h2>
                <div
                    className="text-lg text-gray-600 mb-10 text-center"
                    dangerouslySetInnerHTML={{ __html: section?.description?.[0] || "" }}
                />
                <div className="flex flex-wrap justify-center gap-8">
                    {associations.map(assoc => (
                        <div
                            key={assoc.id}
                            className="bg-white rounded-lg shadow p-4 flex flex-col items-center w-40 text-center"
                        >
                            <img
                                src={assoc.image}
                                alt={assoc.alt || assoc.name}
                                className="h-20 object-contain mb-2"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
