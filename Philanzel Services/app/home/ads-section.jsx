"use client";
import React, { useState, useEffect } from "react";

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const AdsSection = () => {
    const [adsData, setAdsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch ads data from API
    useEffect(() => {
        const fetchAdsData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/ads-sections/active`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const apiResponse = await response.json();
                
                // Extract the first visible item from the data array
                if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
                    const visibleAd = apiResponse.data.find(ad => ad.isVisible) || apiResponse.data[0];
                    setAdsData(visibleAd);
                } else {
                    throw new Error('No ads data found');
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching ads data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch ads data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdsData();
    }, []);

    // Helper function to strip HTML tags from description
    const stripHtmlTags = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Loading state
    if (loading) {
        return (
            <section className="relative py-4 md:py-4 bg-gray-200 overflow-hidden rounded-3xl border-4 border-dotted border-white mx-auto mb-16 max-w-5xl">
                <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-2 md:px-4">
                            <div className="animate-pulse">
                                <div className="h-12 bg-gray-300 rounded w-96 mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded w-64 mb-2"></div>
                                <div className="h-6 bg-gray-300 rounded w-48 mb-6"></div>
                                <div className="h-8 bg-gray-300 rounded w-56 mb-4"></div>
                                <div className="flex gap-4 justify-center">
                                    <div className="h-14 w-32 bg-gray-300 rounded"></div>
                                    <div className="h-14 w-32 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center relative py-4 px-2 md:px-4">
                            <div className="h-64 w-32 bg-gray-300 rounded-2xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error || !adsData) {
        return (
            <section className="relative py-4 md:py-4 bg-gray-100 overflow-hidden rounded-3xl border-4 border-dotted border-white mx-auto mb-16 max-w-5xl">
                <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">
                            {error || 'No ads content available at the moment.'}
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
        <section 
            className="relative py-4 md:py-4 overflow-hidden rounded-3xl border-4 border-dotted border-white mx-auto mb-16 max-w-5xl"
            style={{ backgroundColor: adsData.backgroundColor || '#44ade2ff' }}
        >
            <style>{`
        .banner-dot-bg {
            background-image: radial-gradient(#222 1.5px, transparent 1.5px), radial-gradient(#222 1.5px, transparent 1.5px);
            background-size: 40px 40px;
            background-position: 0 0, 20px 20px;
            opacity: 0.18;
            pointer-events: none;
        }`
            }</style>
            <div className="banner-dot-bg absolute inset-0 w-full h-full z-0" aria-hidden="true"></div>
            <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    {/* Dynamic Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-2 md:px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
                            {adsData.title || "INVEST SMARTER, LIVE BETTER"}
                        </h2>
                        <div className="text-base md:text-lg text-black mb-1">
                            {stripHtmlTags(adsData.description) || "All Your Financial Tools in One App"}
                        </div>
                        <div className="text-base md:text-lg text-black mb-6">
                            {adsData.hashtag || "#StayAhead with Philanzel"}
                        </div>
                        <div className="text-2xl font-semibold mb-4 text-black">Download the Philanzel app</div>
                        <div className="flex gap-4 mt-2 mb-4 justify-center">
                            <a href="#" tabIndex={0} className="focus:outline-none">
                                <img src="/images/play-store-home.png" alt="Google Play" className="h-14 w-auto" />
                            </a>
                            <a href="#" tabIndex={0} className="focus:outline-none">
                                <img src="/images/app-store-home.png" alt="App Store" className="h-14 w-auto" />
                            </a>
                        </div>
                    </div>
                    {/* Dynamic Phone Image */}
                    <div className="flex-1 flex items-center justify-center relative py-4 px-2 md:px-4">
                        <img 
                            src={adsData.imageUrl || adsData.link || "/phone-1.png"} 
                            alt="Philanzel App Screenshot" 
                            className="h-56 md:h-64 w-auto object-contain drop-shadow-xl" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdsSection;