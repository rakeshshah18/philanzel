"use client"
import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export default function CalculatorSection({ section }) {
    const [data, setData] = useState(section || null)
    useEffect(() => {
        if (!section) {
        }
    }, [section])

    if (!data) return null
    const stripHtmlTags = (html) => {
        if (!html) return '';
        const div = typeof window !== 'undefined' ? document.createElement('div') : { innerHTML: '', textContent: '', innerText: '' };
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-cyan-50 rounded-2xl shadow-lg p-10 mb-10">
                <h2 className="text-4xl font-serif font-black text-gray-900 mb-6 text-center">{data.heading || data.sectionName}</h2>
                {data.content && (
                    <div className="prose prose-lg mx-auto mb-8 text-gray-700" dangerouslySetInnerHTML={{ __html: data.content }} />
                )}
                {Array.isArray(data.faqs) && data.faqs.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-2xl font-bold mb-6 text-cyan-700 text-center">FAQs</h3>
                        <Accordion type="single" collapsible className="space-y-4">
                            {data.faqs.map((faq, i) => (
                                <AccordionItem
                                    key={faq._id || `faq-${i}`}
                                    value={`item-${i + 1}`}
                                    className="border border-gray-200 rounded-lg px-6"
                                >
                                    <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 font-sans">
                                        {stripHtmlTags(faq.description)}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
        </section>
    )
}
