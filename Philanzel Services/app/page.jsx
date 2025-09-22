"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/navigation";
import {
  ArrowRight, Shield, TrendingUp, Users, CheckCircle, Star,
  Landmark, HeartPulse, Settings2, Zap, Truck, Factory, ShieldCheck, ShoppingBag, Home, GraduationCap, Briefcase
} from "lucide-react";
import WhyChooseUs from "./home/why-choose-us";
import OurAssociation from "./home/our-association";
import Carousel from "./home/carousel";
import Testimonials from "./home/testimonials";
import StatsCounterSection from "./home/counter";
import ServicesTabsSection from "./home/tabbing-section";
import IndustriesSection from "./home/industries";
import AdsSection from "./home/ads-section";
import FaqSection from "./home/faq-section";
import CtaSection from "./home/cta-section";
import Footer from "./home/footer";
import "./pageStyle.css";

// Define the backend base URL in one place for best practice
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    service: "Million Dollar Club - (MDC)",
    name: "",
    mobile: "",
    email: "",
    captcha: ""
  });

  const slides = [
    {
      title: "Empowering Individuals",
      subtitle: "Your Path to Financial Freedom",
      description: "Take control of your financial future with our comprehensive wealth management solutions",
      ctaText: "Get Started",
      backgroundImage: "/images/empowering-individuals/slide1.jpg"
    },
    {
      title: "Expert Financial Guidance",
      subtitle: "Professional Advisory Services",
      description: "Navigate the complex world of investments with our certified financial experts",
      ctaText: "Learn More",
      backgroundImage: "/images/empowering-individuals/slide2.jpg"
    },
    {
      title: "Secure Your Future",
      subtitle: "Investment Planning Solutions",
      description: "Build a robust portfolio tailored to your goals and risk appetite",
      ctaText: "Start Planning",
      backgroundImage: "/images/empowering-individuals/slide3.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsFormSubmitted(true);
        setFormData({
          service: "Million Dollar Club - (MDC)",
          name: "",
          mobile: "",
          email: "",
          captcha: ""
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Carousel + Form Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-start">
              {/* Carousel */}
              <div className="md:col-span-5 flex flex-col justify-center h-full">
                <Carousel />
                {/* Certified by & Download App section in a row */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                  {/* Certified by */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Certified by:</h4>
                    <div className="flex gap-4 items-center">
                      <img src="/images/AMFI-logo.png" alt="Certification 1" className="h-10 w-auto object-contain" />
                      <img src="/images/irdai-logo.png" alt="Certification 2" className="h-10 w-auto object-contain" />
                    </div>
                  </div>
                  {/* Download App */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Download the Philanzel app</h4>
                    <div className="flex flex-row gap-2">
                      <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                        <img src="/images/play-store-home.png" alt="Get it on Play Store" className="h-6 w-6 object-contain" />
                        <span className="text-gray-900 text-xs font-semibold leading-tight text-left">
                          Get it on<br />
                          <span className="text-base font-bold">Play Store</span>
                        </span>
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                        <img src="/images/app-store-home.png" alt="Get it on App Store" className="h-6 w-6 object-contain" />
                        <span className="text-gray-900 text-xs font-semibold leading-tight text-left">
                          Get it on<br />
                          <span className="text-base font-bold">App Store</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Box */}
              <div className="flex items-center h-full md:col-span-2">
                <form onSubmit={handleFormSubmit} className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Start your Wealth Creation Journey with Philanzel</h3>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Select a Service</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option>Million Dollar Club - (MDC)</option>
                      <option>Retirement Solutions</option>
                      <option>Mutual Funds</option>
                      <option>Insurance</option>
                      <option>Training & Handholding</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-cyan-600 text-white hover:bg-cyan-700 py-3 text-lg font-semibold">
                    Get Started
                  </Button>
                  {isFormSubmitted && (
                    <p className="text-green-600 text-sm text-center">Thank you! We'll get back to you soon.</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* WhyChooseUs Section */}
        <WhyChooseUs />

        {/* Our Association Section */}
        <OurAssociation />

        {/* Stats Counter Section */}
        <StatsCounterSection />

        {/* Services Tabs Section */}
        <ServicesTabsSection />

        {/* Industries Section */}
        <IndustriesSection />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Ads Section */}
        <AdsSection />

        {/* FAQ Section */}
        <FaqSection />

        {/* CTA Section */}
        <CtaSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}