"use client";
import React, { useState, useEffect } from "react";

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Animated stats counter component
const StatsCounterSection = () => {
    const [stats, setStats] = useState([
        { label: "Years Experiences", value: 0, suffix: "+" },
        { label: "Total Expert", value: 0, suffix: "+" },
        { label: "Financial Planning Done", value: 0, suffix: "+" },
        { label: "Happy Customers", value: 0, suffix: "+" },
    ]);
    const [counts, setCounts] = useState([0, 0, 0, 0]);

    useEffect(() => {
        // Fetch stats from API
        async function fetchStats() {
            try {
                const res = await fetch(`${BASE_URL}/api/our-track`);
                const json = await res.json();
                if (json.status === "success" && json.data) {
                    setStats([
                        { label: "Years Experiences", value: json.data.yearExp, suffix: "+" },
                        { label: "Total Expert", value: json.data.totalExpert, suffix: "+" },
                        { label: "Financial Planning Done", value: json.data.planningDone, suffix: "+" },
                        { label: "Happy Customers", value: json.data.happyCustomers, suffix: "+" },
                    ]);
                }
            } catch (e) {
                // fallback: do nothing
            }
        }
        fetchStats();
    }, []);

    useEffect(() => {
        const durations = [1000, 1200, 1400, 1600]; // ms for each stat
        const increments = stats.map((stat, i) => Math.max(1, Math.floor(stat.value / (durations[i] / 16))));
        const intervals = stats.map((stat, i) => setInterval(() => {
            setCounts(prev => {
                const next = [...prev];
                if (next[i] < stat.value) {
                    next[i] = Math.min(stat.value, next[i] + increments[i]);
                }
                return next;
            });
        }, 16));
        return () => intervals.forEach(clearInterval);
    }, [stats]);

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center items-center">
                    {
                        stats.map((stat, i) => (
                            <div key={stat.label} className="bg-white rounded-lg shadow-sm py-8 px-4 text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                    {counts[i].toLocaleString()}{stat.suffix}
                                </div>
                                <div className="uppercase text-xs tracking-widest text-gray-500 font-semibold">{stat.label}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default StatsCounterSection;
