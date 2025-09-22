"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-serif font-black text-cyan-400 mb-4">PMS Investment Services</h3>
                        <p className="text-gray-400 font-sans mb-4">
                            Empowering your financial future with expertise, transparency, and unwavering trust.
                        </p>
                        <div className="text-sm text-gray-400 font-sans">
                            <p>SEBI Registered Investment Advisor</p>
                            <p>Registration No: INA000012345</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4">Services</h4>
                        <ul className="space-y-2 text-gray-400 font-sans">
                            <li>
                                <Link href="/services/portfolio-management" className="hover:text-cyan-400 transition-colors">
                                    Portfolio Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/wealth-planning" className="hover:text-cyan-400 transition-colors">
                                    Wealth Planning
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/risk-assessment" className="hover:text-cyan-400 transition-colors">
                                    Risk Assessment
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/tax-optimization" className="hover:text-cyan-400 transition-colors">
                                    Tax Optimization
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400 font-sans">
                            <li>
                                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/about#team" className="hover:text-cyan-400 transition-colors">
                                    Our Team
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-serif font-bold mb-4">Contact Info</h4>
                        <div className="space-y-2 text-gray-400 font-sans">
                            <p>📧 info@pmsinvestment.com</p>
                            <p>📞 +91 98765 43210</p>
                            <p>📍 Mumbai, Maharashtra</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400 font-sans">
                        © 2024 PMS Investment Services. All rights reserved. | Privacy Policy | Terms of Service
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;