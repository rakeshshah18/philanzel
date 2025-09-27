"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export default function ServicesListPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/services`)
            .then(res => {
                setServices(res.data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setServices([]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-white">
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">Our Services</h1>
                        <p className="text-xl text-gray-600 mb-2 max-w-3xl mx-auto font-sans">Explore our range of personalized financial solutions and discover how we can help you achieve your goals.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.length === 0 && <div className="col-span-full text-center text-gray-500">No services found.</div>}
                        {services.map(service => (
                            <div key={service._id} className="bg-white rounded-lg shadow-xl flex flex-col h-full p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">{service.name}</h2>
                                <p className="text-gray-600 mb-4 flex-1">{service.description || ''}</p>
                                {service.sections && service.sections.length > 0 && (
                                    <ul className="mb-4 text-sm text-gray-500 list-disc list-inside">
                                        {service.sections.map(section => (
                                            <li key={section._id}><span className="font-semibold text-gray-700">{section.title}</span></li>
                                        ))}
                                    </ul>
                                )}
                                <Link href={`/services/${service.slug}`} className="inline-block mt-auto px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                                    View Service
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
