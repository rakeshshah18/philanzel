"use client";
import React, { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const FaqSection = () => {
    const [faqData, setFaqData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch FAQ data from API
    useEffect(() => {
        const fetchFaqData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/home-faqs/public`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const apiResponse = await response.json();
                
                // Extract the first item from the data array
                if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
                    setFaqData(apiResponse.data[0]);
                } else {
                    throw new Error('No FAQ data found');
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching FAQ data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch FAQ data');
            } finally {
                setLoading(false);
            }
        };

        fetchFaqData();
    }, []);

    // Helper function to strip HTML tags from description
    const stripHtmlTags = (html) => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-[600px] mx-auto"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="border border-gray-200 rounded-lg px-6 py-4">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-80 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error || !faqData) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">
                            {error || 'No FAQ content available at the moment.'}
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">
                        {faqData.heading || "Frequently Asked Questions"}
                    </h2>
                    <p className="text-xl text-gray-600 font-sans">
                        {stripHtmlTags(faqData.description) || "Get answers to common questions about our portfolio management services."}
                    </p>
                </div>
                <Accordion type="single" collapsible className="space-y-4">
                    {faqData.faqs && faqData.faqs.length > 0 ? (
                        faqData.faqs.map((faq, index) => (
                            <AccordionItem 
                                key={faq._id || `faq-${index}`} 
                                value={`item-${index + 1}`} 
                                className="border border-gray-200 rounded-lg px-6"
                            >
                                <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 font-sans">
                                    {stripHtmlTags(faq.answer)}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No FAQs available at the moment.</p>
                        </div>
                    )}
                </Accordion>
            </div>
        </section>
    );
};

export default FaqSection;