"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-600 font-sans">
                        Get answers to common questions about our portfolio management services.
                    </p>
                </div>
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-gray-200 rounded-lg px-6">
                        <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                            What is the minimum investment amount?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 font-sans">
                            Our minimum investment varies by plan: ₹25 Lakhs for Essential, ₹50 Lakhs for Premium, and ₹1 Crore for
                            Elite. This ensures we can provide the level of personalized service and diversification that our
                            clients deserve.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border border-gray-200 rounded-lg px-6">
                        <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                            How often will I receive portfolio updates?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 font-sans">
                            Update frequency depends on your plan: Quarterly for Essential, Monthly for Premium, and Weekly
                            monitoring for Elite clients. All clients have 24/7 online access to their portfolio performance and can
                            request updates anytime.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border border-gray-200 rounded-lg px-6">
                        <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                            What types of investments do you focus on?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 font-sans">
                            We invest across a diversified range of asset classes including equities, fixed income, commodities, and
                            alternative investments. Our approach is tailored to each client's risk profile and investment
                            objectives.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="border border-gray-200 rounded-lg px-6">
                        <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                            How do you ensure the security of my investments?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 font-sans">
                            We are registered with SEBI and follow all regulatory guidelines. Your investments are held in your name
                            with qualified custodians, and we maintain comprehensive insurance coverage. We also employ advanced
                            cybersecurity measures to protect your data.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="border border-gray-200 rounded-lg px-6">
                        <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                            Can I withdraw my investments anytime?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 font-sans">
                            Yes, you can request withdrawals at any time. Most withdrawals are processed within 3-5 business days,
                            though some alternative investments may have longer redemption periods. We'll always communicate any
                            restrictions upfront.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
};

export default FaqSection;