"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const CtaSection = () => {
    const [ctaData, setCtaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchCtaData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/footer/optimize-strategies`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const apiResponse = await response.json();
                if (apiResponse.success && apiResponse.data.length > 0) {
                    const visibleCta = apiResponse.data.find(item => item.isVisible && item.isActive) || apiResponse.data[0];
                    setCtaData(visibleCta);
                } else {
                    throw new Error('No CTA data found');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching CTA data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch CTA data');
            } finally {
                setLoading(false);
            }
        };
        fetchCtaData();
    }, []);

    const stripHtmlTags = (html) => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    if (loading) {
        return (
            <section className="py-20 bg-cyan-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-cyan-500 rounded w-96 mx-auto mb-4"></div>
                        <div className="h-6 bg-cyan-500 rounded w-64 mx-auto mb-8"></div>
                        <div className="h-12 bg-cyan-500 rounded w-48 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }
    if (error || !ctaData) {
        return (
            <section className="py-20 bg-cyan-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-red-200 mb-4">
                        {error || 'No CTA content available at the moment.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white text-cyan-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }
    return (
        <section className="py-20 bg-cyan-600">
            <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-serif font-black text-white mb-4">
                    {stripHtmlTags(ctaData.heading) || "Ready To Optimize Your Strategy For Success?"}
                </h2>
                <p className="text-xl text-cyan-100 mb-8 font-sans">
                    {stripHtmlTags(ctaData.description) || "Let's Drive Your Business Forward Today!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                        <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-4 text-lg font-sans btn-animate">
                            Schedule a Consultation
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;