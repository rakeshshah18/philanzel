"use client";
import React from "react";

const AdsSection = () => {
    return (
        <section className="relative py-4 md:py-4 bg-[#97dbfc] overflow-hidden rounded-3xl border-4 border-dotted border-white mx-auto mb-16 max-w-5xl">
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
                    {/* Centered Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-2 md:px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">INVEST SMARTER, LIVE BETTER</h2>
                        <div className="text-base md:text-lg text-black mb-1">All Your Financial Tools in One App</div>
                        <div className="text-base md:text-lg text-black mb-6">#StayAhead with Philanzel</div>
                        <div className="text-2xl font-semibold mb-4 text-black">Download the Philanzel app</div>
                        <div className="flex gap-4 mt-2 mb-4 justify-center">
                            <a href="#" tabIndex={0} className="focus:outline-none">
                                <img src="/google-play-badge.png" alt="Google Play" className="h-14 w-auto" />
                            </a>
                            <a href="#" tabIndex={0} className="focus:outline-none">
                                <img src="/app-store-badge.png" alt="App Store" className="h-14 w-auto" />
                            </a>
                        </div>
                    </div>
                    {/* Phone on Right */}
                    <div className="flex-1 flex items-center justify-center relative py-4 px-2 md:px-4">
                        <img src="/phone-1.png" alt="Philanzel App Screenshot" className="h-56 md:h-64 w-auto object-contain drop-shadow-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdsSection;