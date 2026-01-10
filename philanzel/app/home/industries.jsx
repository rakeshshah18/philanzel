"use client";
import React, { useState, useEffect } from "react";
import {
    Landmark, HeartPulse, Settings2, Zap, Truck, Factory, ShieldCheck, ShoppingBag, Home, GraduationCap, Briefcase
} from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const IndustriesSection = () => {
    const iconClass = "w-6 h-6 text-gray-500";
    const iconMap = {
        "fas-fa-building": <Landmark className={iconClass} />,
        "fas-fa-health": <HeartPulse className={iconClass} />,
        "fas-fa-cog": <Settings2 className={iconClass} />,
        "fas-fa-bolt": <Zap className={iconClass} />,
        "fas-fa-truck": <Truck className={iconClass} />,
        "fas-fa-factory": <Factory className={iconClass} />,
        "fas-fa-shield": <ShieldCheck className={iconClass} />,
        "fas-fa-shopping-bag": <ShoppingBag className={iconClass} />,
        "fas-fa-home": <Home className={iconClass} />,
        "fas-fa-graduation-cap": <GraduationCap className={iconClass} />,
        "fas-fa-briefcase": <Briefcase className={iconClass} />,
    };

    const [industriesData, setIndustriesData] = useState({
        heading: '',
        description: '',
        industries: []
    });

    useEffect(() => {
        async function fetchIndustries() {
            try {
                const res = await fetch(`${BASE_URL}/api/helped-industries/public`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                    setIndustriesData({
                        heading: json.data[0].heading || '',
                        description: json.data[0].description || '',
                        industries: json.data[0].industries || [],
                    });
                }
            } catch (e) {
            }
        }
        fetchIndustries();
    }, []);

    return (
        <section className="py-20 bg-[#f7f7fb]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="mb-2">
                        <span className="text-xs font-semibold tracking-widest text-cyan-600 uppercase">Industries We Help</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: industriesData.heading }}></h2>
                    <div className="text-gray-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: industriesData.description }}></div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto text-center place-items-center">
                        {industriesData.industries.slice(0, 4).map((industry) => (
                            <div key={industry._id} className="bg-white rounded-2xl shadow px-6 py-3 text-base font-semibold text-gray-800 flex flex-col items-center justify-center gap-2 transition hover:bg-cyan-600 hover:text-white hover:shadow-xl cursor-pointer">
                                <div className="flex flex-row items-center justify-center gap-1">
                                    <span className="text-sm align-middle">{iconMap[industry.icon] || null}</span>
                                    <span className="text-sm font-medium whitespace-nowrap align-middle">{industry.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-6xl mx-auto text-center place-items-center">
                        {industriesData.industries.slice(4, 9).map((industry) => (
                            <div key={industry._id} className="bg-white rounded-2xl shadow px-6 py-3 text-base font-semibold text-gray-800 flex flex-col items-center justify-center gap-2 transition hover:bg-cyan-600 hover:text-white hover:shadow-xl cursor-pointer">
                                <div className="flex flex-row items-center justify-center gap-1">
                                    <span className="text-sm align-middle">{iconMap[industry.icon] || null}</span>
                                    <span className="text-sm font-medium whitespace-nowrap align-middle">{industry.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto text-center place-items-center">
                        {industriesData.industries.slice(9, 11).map((industry) => (
                            <div key={industry._id} className="bg-white rounded-2xl shadow px-6 py-3 text-base font-semibold text-gray-800 flex flex-col items-center justify-center gap-2 transition hover:bg-cyan-600 hover:text-white hover:shadow-xl cursor-pointer">
                                <div className="flex flex-row items-center justify-center gap-1">
                                    <span className="text-sm align-middle">{iconMap[industry.icon] || null}</span>
                                    <span className="text-sm font-medium whitespace-nowrap align-middle">{industry.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndustriesSection;