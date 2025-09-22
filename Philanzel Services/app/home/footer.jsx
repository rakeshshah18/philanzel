"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch footer data from API
    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/api/footer/`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const apiResponse = await response.json();

                if (apiResponse.success && apiResponse.data) {
                    setFooterData(apiResponse.data);
                } else {
                    throw new Error('No footer data found');
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching footer data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch footer data');
            } finally {
                setLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    // Helper function to strip HTML tags
    const stripHtmlTags = (html) => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Get current year for copyright
    const currentYear = new Date().getFullYear();

    // Loading state
    if (loading) {
        return (
            <footer className="py-16" style={{ backgroundColor: 'rgb(0, 146, 184)', color: '#ffffff' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-600 rounded w-full"></div>
                                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        );
    }

    // Error state or no data
    if (error || !footerData) {
        return (
            <footer className="py-16" style={{ backgroundColor: 'rgb(0, 146, 184)', color: '#ffffff' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-300 mb-4">
                            {error || 'No footer content available at the moment.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </footer>
        );
    }
    return (
        <footer
            className="py-16"
            style={{
                backgroundColor: 'rgba(0, 101, 126, 1)',
                color: footerData.textColor || '#ffffff'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    {/* About Us Section */}
                    <div>
                        <h3 className="text-lg font-serif font-bold mb-4 text-white">About Us</h3>
                        <p className="text-gray-300 font-sans mb-4 text-sm leading-relaxed">
                            {stripHtmlTags(footerData.aboutUs?.description) || "Philanzel is a leading company providing innovative solutions for businesses worldwide."}
                        </p>
                        {footerData.aboutUs?.readMoreButton?.isEnabled && (
                            <Link
                                href={footerData.aboutUs.readMoreButton.url || "/about-us"}
                                className="inline-block px-4 py-2 border border-gray-400 text-gray-300 text-sm rounded hover:bg-gray-700 transition-colors"
                            >
                                {footerData.aboutUs.readMoreButton.text || "Learn More"}
                            </Link>
                        )}
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4 text-white">
                            {footerData.quickLinks?.title || "Quick Links"}
                        </h4>
                        <ul className="space-y-2 text-gray-300 font-sans text-sm">
                            {footerData.quickLinks?.links
                                ?.filter(link => link.isEnabled)
                                ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                                ?.map((link) => (
                                    <li key={link._id}>
                                        <Link
                                            href={link.url}
                                            className="hover:text-cyan-400 transition-colors"
                                            target={link.openInNewTab ? "_blank" : "_self"}
                                            rel={link.openInNewTab ? "noopener noreferrer" : ""}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Our Services Section */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4 text-white">
                            {footerData.ourServices?.title || "Our Services"}
                        </h4>
                        <ul className="space-y-2 text-gray-300 font-sans text-sm">
                            {footerData.ourServices?.services
                                ?.filter(service => service.isEnabled)
                                ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                                ?.slice(0, 9) // Show first 9 services to match screenshot
                                ?.map((service) => (
                                    <li key={service._id}>
                                        <Link
                                            href={service.url}
                                            className="hover:text-cyan-400 transition-colors"
                                        >
                                            {service.title}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Calculators Section */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4 text-white">
                            {footerData.calculators?.title || "Calculators"}
                        </h4>
                        <ul className="space-y-2 text-gray-300 font-sans text-sm">
                            {footerData.calculators?.calculatorList
                                ?.filter(calc => calc.isEnabled)
                                ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                                ?.map((calc) => (
                                    <li key={calc._id}>
                                        <Link
                                            href={calc.url}
                                            className="hover:text-cyan-400 transition-colors"
                                        >
                                            {calc.title}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4 text-white">
                            {footerData.contactUs?.title || "Contact Us"}
                        </h4>
                        <div className="space-y-2 text-gray-300 font-sans text-sm">
                            {/* Address */}
                            {footerData.contactUs?.address && (
                                <p>
                                    {footerData.contactUs.address.street}, {footerData.contactUs.address.city}, {footerData.contactUs.address.state} {footerData.contactUs.address.zipCode}, {footerData.contactUs.address.country}
                                </p>
                            )}

                            {/* Phone */}
                            {footerData.contactUs?.phoneNumber?.primary && (
                                <p>{footerData.contactUs.phoneNumber.primary}</p>
                            )}

                            {/* Email */}
                            {footerData.contactUs?.email?.primary && (
                                <p>{footerData.contactUs.email.primary}</p>
                            )}
                        </div>

                        {/* Social Media - Follow Us */}
                        {footerData.contactUs?.followUs?.socialLinks?.length > 0 && (
                            <div className="mt-6">
                                <h5 className="text-white font-serif font-bold mb-3">
                                    {footerData.contactUs.followUs.title || "Follow Us"}
                                </h5>
                                <div className="flex space-x-4">
                                    {footerData.contactUs.followUs.socialLinks
                                        ?.filter(social => social.isEnabled)
                                        ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                                        ?.map((social) => {
                                            // Function to get SVG icon based on platform
                                            const getSocialIcon = (platform) => {
                                                const platformLower = platform?.toLowerCase() || '';

                                                if (platformLower.includes('facebook')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                    );
                                                } else if (platformLower.includes('twitter') || platformLower.includes('x')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                        </svg>
                                                    );
                                                } else if (platformLower.includes('instagram')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                        </svg>
                                                    );
                                                } else if (platformLower.includes('linkedin')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                        </svg>
                                                    );
                                                } else if (platformLower.includes('youtube')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                        </svg>
                                                    );
                                                } else if (platformLower.includes('whatsapp')) {
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                                                        </svg>
                                                    );
                                                } else {
                                                    // Default icon for unknown platforms
                                                    return (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M13.723 18.654l-3.61 3.609c-2.316 2.315-6.063 2.315-8.378 0-1.12-1.118-1.735-2.606-1.735-4.188 0-1.582.615-3.07 1.734-4.189l4.866-4.865c2.355-2.355 6.114-2.262 8.377 0 .453.453.81.973 1.089 1.527l-1.593 1.592c-.18-.613-.5-1.189-.964-1.652-1.448-1.448-3.93-1.51-5.439-.001l-4.866 4.866c-.72.72-1.12 1.846-1.12 2.972 0 1.126.4 2.253 1.12 2.973 1.6 1.6 4.2 1.6 5.8 0l2.344-2.344c.26.105.54.18.832.223l1.549 1.548zm1.524-11.309l3.61-3.609c2.315-2.315 6.062-2.315 8.377 0 1.12 1.118 1.735 2.606 1.735 4.188 0 1.582-.615 3.07-1.734 4.189l-4.866 4.865c-2.355 2.355-6.114 2.262-8.377 0-.453-.453-.81-.973-1.089-1.527l1.593-1.592c.18.613.5 1.189.964 1.652 1.448 1.448 3.93 1.51 5.439.001l4.866-4.866c.72-.72 1.12-1.846 1.12-2.972 0-1.126-.4-2.253-1.12-2.973-1.6-1.6-4.2-1.6-5.8 0l-2.344 2.344c-.26-.105-.54-.18-.832-.223z" />
                                                        </svg>
                                                    );
                                                }
                                            };

                                            return (
                                                <a
                                                    key={social._id}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors text-white"
                                                    title={social.platform}
                                                >
                                                    {getSocialIcon(social.platform)}
                                                </a>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-300 font-sans text-sm mb-4 md:mb-0">
                        {footerData.copyrightText?.replace('{year}', currentYear) || `© ${currentYear} Philanzel. All rights reserved.`}
                    </div>
                    <div className="flex space-x-6 text-gray-300 font-sans text-sm">
                        {footerData.privacyPolicy && (
                            <Link href="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                                {footerData.privacyPolicy.title}
                            </Link>
                        )}
                        {footerData.termsOfService && (
                            <Link href="/terms-of-service" className="hover:text-cyan-400 transition-colors">
                                {footerData.termsOfService.title}
                            </Link>
                        )}
                        {footerData.legalDisclaimer && (
                            <Link href="/legal-disclaimer" className="hover:text-cyan-400 transition-colors">
                                {footerData.legalDisclaimer.title}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;