"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../home/footer';
import Cta from '../../home/cta-section';
import Navbar from '../../../components/navigation';
import CalculatorSection from '../sections/CalculatorSection';
import FAQsSection from '../sections/FAQsSection';
import AssociationSection from '../sections/AssociationSection';
import TestimonialSection from '../sections/TestimonialSection';
import FeatureSection from '../sections/FeatureSection';
import HeroSection from '../sections/HeroSection';
import AboutSolutionsSection from '../sections/AboutSolutionsSection';
import OurProcessSection from '../sections/OurProcessSection';
import AdsSection from '../../home/ads-section';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

function normalizeType(type) {
    if (!type) return '';
    return type
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/_/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}
function SectionRenderer({ section }) {
    const rawType = section.type || section.sectionType || section.name || section.sectionName;
    const type = normalizeType(rawType);
    if (["calculator", "calculator-section", "calculators", "calculatorsection"].includes(type)) {
        return <CalculatorSection section={section} />;
    }
    if (["faqs", "faq", "frequently-asked-questions"].includes(type)) {
        return <FAQsSection section={section} />;
    }
    if (["association", "associations", "partners"].includes(type)) {
        return <AssociationSection section={section} />;
    }
    if (["testimonial", "testimonials"].includes(type)) {
        return <TestimonialSection section={section} />;
    }
    if (["feature", "features"].includes(type)) {
        return <FeatureSection section={section} />;
    }
    if (["hero", "hero-section"].includes(type)) {
        return <HeroSection section={section} />;
    }
    if (["about-solutions", "about", "about-section"].includes(type)) {
        return <AboutSolutionsSection section={section} />;
    }
    if (["our-process", "process", "steps"].includes(type)) {
        return <OurProcessSection section={section} />;
    }
    return (
        <div className="bg-white rounded-lg shadow-xl p-8 mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{section.heading || section.sectionName}</h2>
            {section.content && (
                <div className="mb-2 text-gray-600" dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
        </div>
    );
}
export default function CalculatorPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/calculators/pages/slug/${slug}`)
            .then(res => {
                setPage(res.data.data || res.data);
                setLoading(false);
            })
            .catch(() => {
                setPage(null);
                setLoading(false);
            });
    }, [slug]);
    if (loading) return <div>Loading...</div>;
    if (!page) return <div>Calculator not found.</div>;
    const faqSections = page.sections?.filter(section => {
        const type = normalizeType(section.type || section.sectionType || section.name || section.sectionName);
        return ['faqs', 'faq', 'frequently-asked-questions'].includes(type);
    }) || [];
    const otherSections = page.sections?.filter(section => {
        const type = normalizeType(section.type || section.sectionType || section.name || section.sectionName);
        return !['faqs', 'faq', 'frequently-asked-questions'].includes(type);
    }) || [];
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <section className="py-20 bg-white flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">{page.name}</h1>
                        {page.description && (
                            <p className="text-xl text-gray-600 mb-2 max-w-3xl mx-auto font-sans">{page.description}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-10">
                        {otherSections.length > 0 ? (
                            otherSections.map(section => (
                                <SectionRenderer key={section._id || section.sectionName} section={section} />
                            ))
                        ) : (
                            <div className="text-gray-500">No sections found for this calculator.</div>
                        )}
                    </div>
                    <div className="mt-16">
                        {page.sections?.filter(section => {
                            const type = normalizeType(section.type || section.sectionType || section.name || section.sectionName);
                            return ["testimonial", "testimonials"].includes(type);
                        }).map(section => (
                            <SectionRenderer key={section._id || section.sectionName} section={section} />
                        ))}
                    </div>
                    <div className="mt-16">
                        <AdsSection />
                    </div>
                    <div className="mt-16 faq-question">
                        {faqSections.map(section => (
                            <SectionRenderer key={section._id || section.sectionName} section={section} />
                        ))}
                    </div>
                </div>
            </section>
            <Cta />
            <Footer />
        </div>
    );
}
