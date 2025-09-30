"use client"




import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Footer from '../../home/footer';
import Cta from '../../home/cta-section';
import Testimonials from '../../home/testimonials';
import AdsSection from '../../home/ads-section';
import Navbar from '../../../components/navigation';
// If you have an AdsSection component, import it here:


const HeroSection = dynamic(() => import('../sections/HeroSection'));
const FeatureSection = dynamic(() => import('../sections/FeatureSection'));
const TestimonialSection = dynamic(() => import('../sections/TestimonialSection'));
const AboutSolutionsSection = dynamic(() => import('../sections/AboutSolutionsSection'));
const OurProcessSection = dynamic(() => import('../sections/OurProcessSection'));
const WhyChooseUsSection = dynamic(() => import('../sections/WhyChooseUsSection'));
const FAQsSection = dynamic(() => import('../sections/FAQsSection'));
const AssociationSection = dynamic(() => import('../sections/AssociationSection'));
const CalculatorSection = dynamic(() => import('../sections/CalculatorSection'));

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
    const rawType = section.type || section.sectionType || section.name;
    const type = normalizeType(rawType);
    console.log('Rendering section type:', type, section);
    switch (type) {
        case 'hero':
            return <HeroSection section={section} />;
        case 'features':
            return <FeatureSection section={section} />;
        case 'testimonials':
            return <TestimonialSection section={section} />;
        case 'about-solutions':
            return <AboutSolutionsSection section={section} />;
        case 'our-process':
            return <OurProcessSection section={section} />;
        case 'why-choose-us':
            return <WhyChooseUsSection section={section} />;
        case 'faqs':
            return <FAQsSection section={section} />;
        case 'association':
        case 'our-partners':
            return <AssociationSection section={section} />;
        case 'calculator':
        case 'calculator-section':
        case 'calculators':
        case 'calculatorsection':
            return <CalculatorSection section={section} />;
        default:
            return (
                <div className="bg-white rounded-lg shadow-xl p-8 mb-10">
                    {section.title && (
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: section.title }} />
                    )}
                    {Array.isArray(section.heading) && section.heading.length > 0 && (
                        <div className="mb-2">
                            <span className="font-semibold">Heading:</span>
                            {section.heading.map((h, i) => (
                                <span key={i} dangerouslySetInnerHTML={{ __html: h }} />
                            ))}
                        </div>
                    )}
                    {Array.isArray(section.description) && section.description.length > 0 && (
                        <div className="mb-2 text-gray-600">
                            <span className="font-semibold">Description:</span>
                            {section.description.map((d, i) => (
                                <div key={i} dangerouslySetInnerHTML={{ __html: d }} />
                            ))}
                        </div>
                    )}
                    {Array.isArray(section.subheading) && section.subheading.length > 0 && (
                        <div className="mb-2">
                            <span className="font-semibold">Subheading:</span>
                            {section.subheading.map((sh, i) => (
                                <span key={i} dangerouslySetInnerHTML={{ __html: sh }} />
                            ))}
                        </div>
                    )}
                    {Array.isArray(section.subdescription) && section.subdescription.length > 0 && (
                        <div className="mb-2 text-gray-600">
                            <span className="font-semibold">Subdescription:</span>
                            {section.subdescription.map((sd, i) => (
                                <div key={i} dangerouslySetInnerHTML={{ __html: sd }} />
                            ))}
                        </div>
                    )}
                </div>
            );
    }
}

export default function UserServicePage() {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/services/slug/${slug}`)
            .then(res => {
                setService(res.data.data);
                setLoading(false);
            })
            .catch(() => {
                setService(null);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (!service) return <div>Service not found.</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <section className="py-20 bg-white flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1
                            className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6"
                            dangerouslySetInnerHTML={{
                                __html: service.name
                                    ?.replace(/-/g, " ")
                                    .replace(/\b\w/g, char => char.toUpperCase())
                            }}
                        />
                        {service.description && (
                            <p className="text-xl text-gray-600 mb-2 max-w-3xl mx-auto font-sans" dangerouslySetInnerHTML={{ __html: service.description }} />
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-10">
                        {service.sections && service.sections.length > 0 ? (
                            service.sections.map(section => (
                                <SectionRenderer key={section._id} section={section} />
                            ))
                        ) : (
                            <div className="text-gray-500">No sections found for this service.</div>
                        )}
                    </div>
                </div>
            </section>
            {/* Ads Section removed (component not found) */}
            {/* Testimonials Section */}
            <Testimonials />
            <AdsSection />
            {/* CTA Section */}
            <Cta />
            {/* Footer Section */}
            <Footer />
        </div>
    );
}
