"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
    return (
        <section className="py-20 bg-cyan-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-serif font-black text-white mb-4">Ready To Optimize Your Strategy For Success?</h2>
                <p className="text-xl text-cyan-100 mb-8 font-sans">
                    Let's Drive Your Business Forward Today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/consultation">
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