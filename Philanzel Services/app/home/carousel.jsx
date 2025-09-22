'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Carousel() {
    const [carouselData, setCarouselData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const prevIdx = useRef(0);
    const total = carouselData.length;

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${BASE_URL}/api/homepage`);
                const json = await res.json();
                if (json.status === "success" && Array.isArray(json.data)) {
                    setCarouselData(json.data);
                }
            } catch (e) {
                setCarouselData([]);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (total === 0) return;
        const interval = setInterval(() => {
            if (!animating) {
                prevIdx.current = current;
                setAnimating(true);
                setCurrent((current + 1) % total);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [current, animating, total]);

    const prev = () => {
        if (animating || total === 0) return;
        prevIdx.current = current;
        setAnimating(true);
        setCurrent((current - 1 + total) % total);
    };
    const next = () => {
        if (animating || total === 0) return;
        prevIdx.current = current;
        setAnimating(true);
        setCurrent((current + 1) % total);
    };

    const direction = current > prevIdx.current || (current === 0 && prevIdx.current === total - 1) ? 1 : -1;
    const handleAnimationEnd = () => setAnimating(false);
    if (total === 0) {
        return null;
    }

    const { heading, description, image, button } = carouselData[current];

    return (
        <div className="relative flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
            <button
                onClick={prev}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-100 hover:bg-cyan-600 hover:text-white text-cyan-600 shadow-lg items-center justify-center"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <div
                key={current}
                className={`flex-1 flex flex-col md:flex-row items-center transition-transform duration-900 ease-in-out ${animating ? (direction === 1 ? 'animate-slide-left' : 'animate-slide-right') : ''}`}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className="flex-1 p-8">
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">{heading}</h2>
                    {/* Description may contain HTML */}
                    <div className="text-lg text-gray-600 mb-6 font-sans" dangerouslySetInnerHTML={{ __html: description }} />
                    {button && button.link && (
                        <a href={button.link} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
                                {button.text || "Learn More"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </a>
                    )}
                </div>
                <div className="flex-1 min-w-[300px] h-full flex items-center justify-center bg-gray-50">
                    <img src={image?.url} alt={image?.altText || heading} className="object-cover w-full h-80 md:h-96 rounded-none" />
                </div>
            </div>
            {/* Right Arrow Button */}
            <button
                onClick={next}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-100 hover:bg-cyan-600 hover:text-white text-cyan-600 shadow-lg items-center justify-center"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mx-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
            {/* Dots - bottom center */}
            <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-2">
                {carouselData.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${idx === current ? 'bg-cyan-600' : 'bg-gray-300'}`}
                        onClick={() => { if (!animating) { prevIdx.current = current; setCurrent(idx); } }}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}