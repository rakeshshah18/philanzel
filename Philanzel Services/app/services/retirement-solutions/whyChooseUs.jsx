"use client";
import React, { useEffect, useState } from "react";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const WhyChooseUs = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${BASE_URL}/api/why-choose-us`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                    setData(json.data[0]);
                }
            } catch (e) {
                // fallback: do nothing
            }
        }
        fetchData();
    }, []);

    if (!data) {
        return null; // or a loading spinner
    }

    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                            src={data.image?.url ? `${BASE_URL}${data.image.url}` : "/pms-img-2.jpg"}
                            alt={data.image?.originalName || "Professional financial advisors"}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded w-max mb-4">WHY CHOOSE US ?</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: data.heading }} />
                        <div className="text-gray-700 mb-6 max-w-xl" dangerouslySetInnerHTML={{ __html: data.description }} />
                        <hr className="my-4 border-gray-200" />
                        <ul className="space-y-4 mb-8">
                            {data.points?.map((point) => {
                                // Map old Font Awesome 5 class to v6 if needed
                                let iconClass = point.icon || "fa-solid fa-check";
                                if (iconClass === "fas fa-check") iconClass = "fa-solid fa-check";
                                // Add more mappings if your API uses other 'fas' icons
                                return (
                                    <li key={point._id} className="flex items-start gap-3">
                                        <i className={iconClass + " w-5 h-5 text-cyan-600 mt-1 flex-shrink-0 bg-cyan-200 rounded-4xl"}></i>
                                        <span>{point.description || point.title || point.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        {data.button && (
                            <a href={data.button.link || "#"} className="mt-2 px-8 py-3 bg-gray-900 text-white font-semibold rounded-full shadow w-max relative overflow-hidden group">
                                <span className="pointer-events-none absolute inset-0 z-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 scale-0 opacity-0 rounded-full bg-[radial-gradient(circle,rgba(13,110,253,1)_0%,rgba(13,110,253,1)_100%)]"></span>
                                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                    {data.button.text}
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;