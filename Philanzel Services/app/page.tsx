
"use client"
import Link from "next/link";

const servicesTabs = [
  {
    label: "Retirement Solutions",
    image: "/images/retirement.jpg",
    heading: "Plan today. Relax tomorrow.",
    description: "Secure your golden years with a customized retirement plan that ensures financial independence and peace of mind. We help you estimate future needs, optimize savings, and choose the right investment options for a stress-free retirement.",
    button: "Read more -"
  },
  {
    label: "Mutual Fund Distribution",
    image: "/images/mutual-fund.jpg",
    heading: "Grow your wealth with experts.",
    description: "Access a wide range of mutual funds tailored to your goals and risk profile. Our experts guide you through fund selection, portfolio balancing, and ongoing management.",
    button: "Read more -"
  },
  {
    label: "Insurance",
    image: "/images/insurance.jpg",
    heading: "Protect what matters most.",
    description: "Comprehensive insurance solutions for life, health, and assets. Get peace of mind with the right coverage and expert advice.",
    button: "Read more -"
  },
  {
    label: "Training & Handholding",
    image: "/images/training.jpg",
    heading: "Empower your financial journey.",
    description: "Personalized training and handholding for investors at every stage. Learn, grow, and make informed decisions with our support.",
    button: "Read more -"
  },
  {
    label: "Demat",
    image: "/images/demat.jpg",
    heading: "Seamless digital investing.",
    description: "Open and manage your Demat account with ease. Enjoy secure, paperless transactions and expert assistance.",
    button: "Read more -"
  },
  {
    label: "AIF",
    image: "/images/aif.jpg",
    heading: "Alternative Investment Funds.",
    description: "Diversify your portfolio with exclusive AIF opportunities, managed by seasoned professionals.",
    button: "Read more -"
  },
  {
    label: "Health Insurance",
    image: "/images/health-insurance.jpg",
    heading: "Health comes first.",
    description: "Comprehensive health insurance plans for you and your family, with expert claims support.",
    button: "Read more -"
  },
  {
    label: "PMS",
    image: "/images/pms.jpg",
    heading: "Portfolio Management Services (PMS)",
    description: "Professional portfolio management tailored to your financial goals. Benefit from expert strategies and personalized service.",
    button: "Read more -"
  },
  {
    label: "Private Equity",
    image: "/images/private-equity.jpg",
    heading: "Private Equity",
    description: "Access exclusive private equity opportunities and diversify your investment portfolio with our expert guidance.",
    button: "Read more -"
  },
];

function ServicesTabsSection() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded">OUR SERVICES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">What We Offer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover personalized financial solutions crafted to help you achieve both personal and business success.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs and Tab Content */}
          <div className="flex-1 min-w-0">
            <div
              className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}
            >
              <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .hide-scrollbar::-webkit-scrollbar { display: none; }
              `}</style>

              {servicesTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === idx ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-gray-700 hover:text-cyan-600'}`}
                  onClick={() => setActiveTab(idx)}
                  style={{ minWidth: 'max-content' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img src={servicesTabs[activeTab].image} alt={servicesTabs[activeTab].label} className="w-48 h-48 object-cover rounded-lg shadow" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{servicesTabs[activeTab].heading}</h3>
                <p className="text-gray-700 mb-4">{servicesTabs[activeTab].description}</p>
                <button className="text-cyan-700 font-semibold hover:underline text-sm">{servicesTabs[activeTab].button}</button>
              </div>
            </div>
          </div>
          {/* Right Side Card */}
          <div className="w-full md:w-80 flex-shrink-0 self-start">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src="/images/expert-card.jpg" alt="Expert Review" className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <div className="text-white text-lg font-semibold mb-2">Get Your Finances<br />Reviewed by Our Experts</div>
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded shadow">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import { useState, useEffect, useRef } from "react"

// Animated stats counter component
function StatsCounterSection() {
  const stats = [
    { label: "Years Experiences", value: 15, suffix: "+" },
    { label: "Total Expert", value: 675, suffix: "+" },
    { label: "Financial Planning Done", value: 12500, suffix: "+" },
    { label: "Happy Customers", value: 8237, suffix: "+" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

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
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center items-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm py-8 px-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {counts[i].toLocaleString()}{stat.suffix}
              </div>
              <div className="uppercase text-xs tracking-widest text-gray-500 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowRight, Shield, TrendingUp, Users, CheckCircle, Star,
  Landmark, HeartPulse, Settings2, Zap, Truck, Factory, ShieldCheck, ShoppingBag, Home, GraduationCap, Briefcase
} from "lucide-react"
type IndustryPillProps = {
  icon: React.ReactNode;
  label: string;
};

function IndustryPill({ icon, label }: IndustryPillProps) {
  return (
    <div
      className="relative overflow-hidden flex flex-row items-center gap-3 text-center bg-white rounded-full shadow px-6 py-3 font-semibold text-gray-700 text-lg min-h-[48px] min-w-[48px] cursor-pointer group"
    >
      {/* Animated radial gradient overlay */}
      <span className="pointer-events-none absolute inset-0 z-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 scale-0 opacity-0 rounded-full bg-[radial-gradient(circle,rgba(13,110,253,1)_0%,rgba(13,110,253,1)_100%)]"></span>
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{icon}</span>
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{label}</span>
    </div>
  );
}

const iconClass = "w-6 h-6 text-gray-500";
const BankIcon = () => <Landmark className={iconClass} />;
const HeartIcon = () => <HeartPulse className={iconClass} />;
const SettingsIcon = () => <Settings2 className={iconClass} />;
const BoltIcon = () => <Zap className={iconClass} />;
const TruckIcon = () => <Truck className={iconClass} />;
const FactoryIcon = () => <Factory className={iconClass} />;
const ShieldIcon = () => <ShieldCheck className={iconClass} />;
const ShoppingBagIcon = () => <ShoppingBag className={iconClass} />;
const HomeIcon = () => <Home className={iconClass} />;
const GraduationCapIcon = () => <GraduationCap className={iconClass} />;
const BriefcaseIcon = () => <Briefcase className={iconClass} />;
import Navigation from "@/components/navigation"


// Carousel data and component (move above HomePage)
const carouselData = [
  {
    heading: "Personalized Portfolio Management",
    description: "Get investment strategies tailored to your unique goals and risk profile, managed by experienced professionals.",
    image: "/images/pms-img-1.jpg",
    link: "/services/portfolio-management"
  },
  {
    heading: "Comprehensive Wealth Planning",
    description: "Plan for your future with holistic financial solutions, including tax optimization, estate planning, and more.",
    image: "/images/pms-img-2.jpg",
    link: "/services/wealth-planning"
  },
  {
    heading: "Expert Risk Assessment",
    description: "Protect your assets with advanced risk analysis and proactive management for peace of mind.",
    image: "/images/pms-img-3.jpg",
    link: "/services/risk-assessment"
  }
]


function Carousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const prevIdx = useRef(0)
  const total = carouselData.length

  // Auto-slide every 2 seconds
  useEffect(() => {
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
    if (animating) return
    prevIdx.current = current
    setAnimating(true)
    setCurrent((current - 1 + total) % total)
  }
  const next = () => {
    if (animating) return
    prevIdx.current = current
    setAnimating(true)
    setCurrent((current + 1) % total)
  }

  // Animation direction
  const direction = current > prevIdx.current || (current === 0 && prevIdx.current === total - 1) ? 1 : -1

  // End animation after transition
  const handleAnimationEnd = () => setAnimating(false)

  const { heading, description, image, link } = carouselData[current]

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left Arrow Button */}
      <button
        onClick={prev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gray-100 hover:bg-cyan-600 hover:text-white text-cyan-600 shadow-lg items-center justify-center"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      {/* Animated Slide Content */}
      <div
        key={current}
        className={`flex-1 flex flex-col md:flex-row items-center transition-transform duration-900 ease-in-out ${animating ? (direction === 1 ? 'animate-slide-left' : 'animate-slide-right') : ''}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex-1 p-8">
          <h2 className="text-4xl font-serif font-black text-gray-900 mb-4">{heading}</h2>
          <p className="text-lg text-gray-600 mb-6 font-sans">{description}</p>
          <Link href={link}>
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="flex-1 min-w-[300px] h-full flex items-center justify-center bg-gray-50">
          <img src={image} alt={heading} className="object-cover w-full h-80 md:h-96 rounded-none" />
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
      {/* Animation styles */}
      <style jsx>{`
        .animate-slide-left {
          animation: slideLeft 0.5s forwards;
        }
        .animate-slide-right {
          animation: slideRight 0.5s forwards;
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
  </div>
  )
}

export default function HomePage() {
  return (
    <div className= "min-h-screen bg-white" >
    <Navigation />

  {/* Carousel + Form Section */ }
  <section className="bg-gradient-to-br from-gray-50 to-white py-20" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
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
          <form className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Start your Wealth Creation Journey with Philanzel</h3>
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Select a Service</label>
        <select id="service" name="service" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option>Million Dollar Club - (MDC)</option>
          <option>Retirement Solutions</option>
          <option>Mutual Funds</option>
          <option>Insurance</option>
          <option>Training & Handholding</option>
          <option>Alternative Investment Fund(AIF)</option>
          <option>Health Insurance</option>
          <option>Portfolio Management Services(PMS)</option>
          <option>PE FUND</option>
        </select>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input id="name" name="name" type="text" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input id="email" name="email" type="email" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input id="phone" name="phone" type="tel" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
      </div>
                                      <div className="flex items-start">
                                        <input id="consent" name="consent" type="checkbox" required className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
                                        <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                                          By continuing, you provide consent and agree to our{' '}
                                          <a href="/terms" className="underline text-cyan-600" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
                                        </label>
                                            </div>
                                            < Button type = "submit" className = "w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg rounded-md" > Continue </Button>
                                              </form>
                                              </div>
                                              </div>
                                              </div>
                                              </section>



  {/* Stats Section with Counter */}
  <StatsCounterSection />

  {/* Services Tabs Section */}
  <ServicesTabsSection />


  {/* Industries We Help Section */}
  <section className="py-20 bg-[#f7f7fb]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="mb-2">
          <span className="text-xs font-semibold tracking-widest text-cyan-600 uppercase">Industries We Help</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Risk & Compliance Services Tailored<br className="hidden md:block" /> to Your Industry</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Customized financial strategies and regulatory support designed to fuel your business growth and long-term success.</p>
      </div>
  <div className="flex flex-col items-center justify-center gap-4 text-center">
        {/* Row 1: 4 items */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto text-center place-items-center">
          <IndustryPill icon={<BankIcon />} label="Financial Services" />
          <IndustryPill icon={<HeartIcon />} label="Healthcare" />
          <IndustryPill icon={<SettingsIcon />} label="Technology" />
          <IndustryPill icon={<BoltIcon />} label="Energy" />
        </div>
        {/* Row 2: 5 items */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-6xl mx-auto text-center place-items-center">
          <IndustryPill icon={<TruckIcon />} label="Logistics" />
          <IndustryPill icon={<FactoryIcon />} label="Manufacturing" />
          <IndustryPill icon={<ShieldIcon />} label="Life Insurance" />
          <IndustryPill icon={<ShoppingBagIcon />} label="Retail" />
          <IndustryPill icon={<HomeIcon />} label="Real Estate" />
        </div>
        {/* Row 3: 2 items */}
  <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto text-center place-items-center">
          <IndustryPill icon={<GraduationCapIcon />} label="Education" />
          <IndustryPill icon={<BriefcaseIcon />} label="Startups & Entrepreneurs" />
        </div>
      </div>
    </div>
  </section>





  {/* Why Choose us? */ }
  <section id="about" className = "py-20 bg-white" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" >
        <div className = "relative" >
          <img
            src="/pms-img-2.jpg"
            alt = "Professional financial advisors"
            className = "rounded-lg shadow-xl"
          />
        </div>
        <div className="flex flex-col justify-center h-full">
          <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded w-max mb-4">WHY CHOOSE US?</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Financial Journeys</h2>
          <p className="text-gray-700 mb-6 max-w-xl">At Philanzel, we go beyond just offering financial services — we become your trusted partner in building a secure and successful future.</p>
          <hr className="my-4 border-gray-200" />
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Every client is unique. We tailor solutions based on your goals, risk appetite, and timeline.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Backed by over 15 years of experience, our team brings deep knowledge and insight into every interaction.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>From mutual funds to insurance, PMS to AIF — we provide end-to-end investment and protection solutions.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>Our success lies in your satisfaction. We focus on trust, transparency, and long-term relationships.</span>
            </li>
          </ul>
          <Link href="/consultation" className="mt-2 px-8 py-3 bg-gray-900 text-white font-semibold rounded-full shadow w-max relative overflow-hidden group">
            <span className="pointer-events-none absolute inset-0 z-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 scale-0 opacity-0 rounded-full bg-[radial-gradient(circle,rgba(13,110,253,1)_0%,rgba(13,110,253,1)_100%)]"></span>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Schedule A Consultation</span>
          </Link>
        </div>
    </div>
    </div>
    </section>


  {/* Our Associations */ }
  

  {/* Client Testimonials */ }
  {/* Our Associations Section */}
  <section className="py-20 bg-[#f7f7fb]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Heading, subtitle, button */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Associations</h2>
          <p className="text-gray-600 mb-8">that's what you get when you choose Philanzel</p>
          <button className="bg-gray-800 text-white font-semibold rounded-full px-8 py-3 shadow hover:bg-cyan-700 transition-colors duration-300">View All</button>
        </div>
        {/* Right: Card with logos grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes scroll-right {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
          `}</style>
          <div className="grid grid-rows-3 gap-6 w-full">
            {/* Row 1: right to left */}
            <div className="overflow-hidden">
              <div className="flex gap-8 min-w-max animate-scroll-left" style={{ animation: 'scroll-left 18s linear infinite' }}>
                <img src="/images/axis-mf.png" alt="Axis Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/birla-mf.png" alt="Birla Sun Life" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/hdfc-mf.png" alt="HDFC Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/icici-mf.png" alt="ICICI Prudential" className="h-12 object-contain bg-white rounded shadow p-2" />
                {/* duplicate for seamless loop */}
                <img src="/images/axis-mf.png" alt="Axis Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/birla-mf.png" alt="Birla Sun Life" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/hdfc-mf.png" alt="HDFC Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/icici-mf.png" alt="ICICI Prudential" className="h-12 object-contain bg-white rounded shadow p-2" />
              </div>
            </div>
            {/* Row 2: left to right */}
            <div className="overflow-hidden">
              <div className="flex gap-8 min-w-max animate-scroll-right" style={{ animation: 'scroll-right 20s linear infinite' }}>
                <img src="/images/reliance-mf.png" alt="Reliance Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/dsp-mf.png" alt="DSP Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/sbi-mf.png" alt="SBI Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/motilal-mf.png" alt="Motilal Oswal" className="h-12 object-contain bg-white rounded shadow p-2" />
                {/* duplicate for seamless loop */}
                <img src="/images/reliance-mf.png" alt="Reliance Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/dsp-mf.png" alt="DSP Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/sbi-mf.png" alt="SBI Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/motilal-mf.png" alt="Motilal Oswal" className="h-12 object-contain bg-white rounded shadow p-2" />
              </div>
            </div>
            {/* Row 3: right to left */}
            <div className="overflow-hidden">
              <div className="flex gap-8 min-w-max animate-scroll-left" style={{ animation: 'scroll-left 22s linear infinite' }}>
                <img src="/images/uti-mf.png" alt="UTI Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/edelweiss-mf.png" alt="Edelweiss Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/nippon-mf.png" alt="Nippon India" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/quant-mf.png" alt="Quant Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                {/* duplicate for seamless loop */}
                <img src="/images/uti-mf.png" alt="UTI Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/edelweiss-mf.png" alt="Edelweiss Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/nippon-mf.png" alt="Nippon India" className="h-12 object-contain bg-white rounded shadow p-2" />
                <img src="/images/quant-mf.png" alt="Quant Mutual Fund" className="h-12 object-contain bg-white rounded shadow p-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="testimonials" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded w-max mb-4 inline-block">OUR TESTIMONIALS</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">What Clients Say?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Our Clients Say About Our Services</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-6 w-6" />
          <span className="font-semibold">Reviews</span>
          <span className="font-bold ml-2">4.7</span>
          <span className="flex items-center ml-1 text-amber-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
          </span>
          <span className="text-gray-500 text-sm ml-1">(18)</span>
        </div>
        <button className="bg-gray-900 text-white font-semibold rounded-full px-8 py-2 shadow hover:bg-cyan-700 transition-colors duration-300">Write a Review</button>
      </div>
      <div className="relative mt-8">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-cyan-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200 z-10"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial Card 1 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-100">
            <div className="flex items-center mb-2">
              <span className="w-10 h-10 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-lg mr-3">A</span>
              <span className="font-semibold text-lg text-gray-900">Avinash Kashyap</span>
              <span className="ml-auto"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-6 w-6" /></span>
            </div>
            <div className="flex items-center mb-2">
              <span className="flex text-amber-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              </span>
            </div>
            <hr className="my-2 border-gray-200" />
            <p className="text-gray-700 text-sm flex-1">I had a great experience with Philanzel. Their service was smooth and professional from start to finish.They provided clear guidance on equity market returns, mutual funds, and bonds, helping me make informed investment decisions. Everything was delivered as promised, and they even went the extra mile to ensure I felt confident and well-supported. Highly recommended for anyone looking for reliable and knowledgeable financial support. Thank you, Philanzel!</p>
          </div>
          {/* Testimonial Card 2 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-100">
            <div className="flex items-center mb-2">
              <span className="w-10 h-10 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-lg mr-3">S</span>
              <span className="font-semibold text-lg text-gray-900">Sarvjeet Singh</span>
              <span className="ml-auto"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-6 w-6" /></span>
            </div>
            <div className="flex items-center mb-2">
              <span className="flex text-amber-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              </span>
            </div>
            <hr className="my-2 border-gray-200" />
            <p className="text-gray-700 text-sm flex-1">I am deeply grateful for the association with Philanzel over these years. Their expertise and invaluable guidance for mutual funds and wealth creation have guided me so well in my financial journey. And, still going strong with their well researched analysis and advice beating the market volatility and keeping the graph of wealth creation rising come what may!</p>
          </div>
          {/* Testimonial Card 3 */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full border border-gray-100">
            <div className="flex items-center mb-2">
              <span className="w-10 h-10 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-lg mr-3">L</span>
              <span className="font-semibold text-lg text-gray-900">Lekh Raj</span>
              <span className="ml-auto"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="h-6 w-6" /></span>
            </div>
            <div className="flex items-center mb-2">
              <span className="flex text-amber-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
              </span>
            </div>
            <hr className="my-2 border-gray-200" />
            <p className="text-gray-700 text-sm flex-1">I am very happy with Philanzel. They helped me understand about mutual funds, shares, and insurance .I was confused before, but they explained everything in simple words. Their team is very friendly and always ready to answer my questions. I feel safe and confident with my money because of them. Thank you, Philanzel, for your good work!</p>
          </div>
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-cyan-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center shadow transition-colors duration-200 z-10"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
      </div>
    </div>
  </section>

  {/* Banner/Ads Section */}
  <section className="relative py-4 md:py-4 bg-[#97dbfc] overflow-hidden rounded-3xl border-4 border-dotted border-white mx-auto mb-16 max-w-5xl">
    <style>{`
      .banner-dot-bg {
        background-image: radial-gradient(#222 1.5px, transparent 1.5px), radial-gradient(#222 1.5px, transparent 1.5px);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
        opacity: 0.18;
        pointer-events: none;
      }
    `}</style>
    <div className="banner-dot-bg absolute inset-0 w-full h-full z-0" aria-hidden="true"></div>
  <div className="relative z-10 max-w-3xl mx-auto px-2 sm:px-4 lg:px-6">
  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        {/* Centered Content */}
  <div className="flex-1 flex flex-col items-center justify-center text-center py-4 px-2 md:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">INVEST SMARTER, LIVE BETTER</h2>
          <div className="text-base md:text-lg text-black mb-1">All Your Financial Tools in One App</div>
          <div className="text-base md:text-lg text-black mb-6">#StayAhead with Philanzel</div>
          <div className="text-2xl font-semibold mb-4 text-black">Download the Philanzel app</div>
          <div className="flex gap-4 mt-2 mb-4 justify-center">
            <a href="#" tabIndex={0} className="focus:outline-none">
              <img src="/google-play-badge.png" alt="Google Play" className="h-14 w-auto" />
            </a>
            <a href="#" tabIndex={0} className="focus:outline-none">
              <img src="/app-store-badge.png" alt="App Store" className="h-14 w-auto" />
            </a>
          </div>
        </div>
        {/* Phone on Right */}
        <div className="flex-1 flex items-center justify-center relative py-4 px-2 md:px-4">
          <img src="/phone-1.png" alt="Philanzel App Screenshot" className="h-56 md:h-64 w-auto object-contain drop-shadow-xl" />
        </div>
      </div>
    </div>
  </section>
  {/* FAQs */ }
  <section className="py-20 bg-white" >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div className="text-center mb-16" >
        <h2 className="text-4xl font-serif font-black text-gray-900 mb-4" > Frequently Asked Questions </h2>
          < p className = "text-xl text-gray-600 font-sans" >
            Get answers to common questions about our portfolio management services.
            </p>
              </div>
              < Accordion type = "single" collapsible className = "space-y-4" >
                <AccordionItem value="item-1" className = "border border-gray-200 rounded-lg px-6" >
                  <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600" >
                    What is the minimum investment amount ?
                      </AccordionTrigger>
                      < AccordionContent className = "text-gray-600 font-sans" >
                        Our minimum investment varies by plan: ₹25 Lakhs for Essential, ₹50 Lakhs for Premium, and ₹1 Crore for
                Elite.This ensures we can provide the level of personalized service and diversification that our
                clients deserve.
              </AccordionContent>
    </AccordionItem>
    < AccordionItem value = "item-2" className = "border border-gray-200 rounded-lg px-6" >
      <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600" >
        How often will I receive portfolio updates ?
          </AccordionTrigger>
          < AccordionContent className = "text-gray-600 font-sans" >
            Update frequency depends on your plan: Quarterly for Essential, Monthly for Premium, and Weekly
                monitoring for Elite clients.All clients have 24 / 7 online access to their portfolio performance and can
                request updates anytime.
              </AccordionContent>
    </AccordionItem>
    < AccordionItem value = "item-3" className = "border border-gray-200 rounded-lg px-6" >
      <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600" >
        What types of investments do you focus on ?
          </AccordionTrigger>
          < AccordionContent className = "text-gray-600 font-sans" >
            We invest across a diversified range of asset classes including equities, fixed income, commodities, and
                alternative investments.Our approach is tailored to each client's risk profile and investment
  objectives.
              </AccordionContent>
    </AccordionItem>
    < AccordionItem value = "item-4" className = "border border-gray-200 rounded-lg px-6" >
      <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600" >
        How do you ensure the security of my investments ?
          </AccordionTrigger>
          < AccordionContent className = "text-gray-600 font-sans" >
            We are registered with SEBI and follow all regulatory guidelines.Your investments are held in your name
  with qualified custodians, and we maintain comprehensive insurance coverage.We also employ advanced
                cybersecurity measures to protect your data.
              </AccordionContent>
    </AccordionItem>
    < AccordionItem value = "item-5" className = "border border-gray-200 rounded-lg px-6" >
      <AccordionTrigger className="text-left font-serif font-bold text-gray-900 hover:text-cyan-600" >
        Can I withdraw my investments anytime ?
          </AccordionTrigger>
          < AccordionContent className = "text-gray-600 font-sans" >
            Yes, you can request withdrawals at any time.Most withdrawals are processed within 3 - 5 business days,
              though some alternative investments may have longer redemption periods.We'll always communicate any
                restrictions upfront.
              </AccordionContent>
    </AccordionItem>
    </Accordion>
    </div>
    </section>

  {/* CTA Section */ }
  <section className="py-20 bg-cyan-600" >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" >
      <h2 className="text-3xl font-serif font-black text-white mb-4" > Ready To Optimize Your Strategy For Success? </h2>
        < p className = "text-xl text-cyan-100 mb-8 font-sans" >
          Let’s Drive Your Business Forward Today!
          </p>
            < div className = "flex flex-col sm:flex-row gap-4 justify-center" >
              <Link href="/consultation" >
                <Button size="lg" className = "bg-white text-cyan-600 hover:bg-gray-100 px-8 py-4 text-lg font-sans btn-animate" >
                  Schedule a Consultation
                    < ArrowRight className = "ml-2 h-5 w-5" />
                      </Button>
                      </Link>
                      
      </div>
      </div>
      </section>

  {/* Footer */ }
  <footer className="bg-gray-900 text-white py-16" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8" >
        <div>
        <h3 className="text-2xl font-serif font-black text-cyan-400 mb-4" > PMS Investment Services </h3>
          < p className = "text-gray-400 font-sans mb-4" >
            Empowering your financial future with expertise, transparency, and unwavering trust.
              </p>
              < div className = "text-sm text-gray-400 font-sans" >
                <p>SEBI Registered Investment Advisor </p>
                  < p > Registration No: INA000012345 </p>
                    </div>
                    </div>
                    < div >
                    <h4 className="text-lg font-serif font-bold mb-4" > Services </h4>
                      < ul className = "space-y-2 text-gray-400 font-sans" >
                        <li>
                        <Link href="/services/portfolio-management" className = "hover:text-cyan-400 transition-colors" >
                          Portfolio Management
                            </Link>
                            </li>
                            < li >
                            <Link href="/services/wealth-planning" className = "hover:text-cyan-400 transition-colors" >
                              Wealth Planning
                                </Link>
                                </li>
                                < li >
                                <Link href="/services/risk-assessment" className = "hover:text-cyan-400 transition-colors" >
                                  Risk Assessment
                                    </Link>
                                    </li>
                                    < li >
                                    <Link href="/services/tax-optimization" className = "hover:text-cyan-400 transition-colors" >
                                      Tax Optimization
                                        </Link>
                                        </li>
                                        </ul>
                                        </div>
                                        < div >
                                        <h4 className="text-lg font-serif font-bold mb-4" > Company </h4>
                                          < ul className = "space-y-2 text-gray-400 font-sans" >
                                            <li>
                                            <Link href="/about" className = "hover:text-cyan-400 transition-colors" >
                                              About Us
                                                </Link>
                                                </li>
                                                < li >
                                                <Link href="/about#team" className = "hover:text-cyan-400 transition-colors" >
                                                  Our Team
                                                    </Link>
                                                    </li>
                                                    < li >
                                                    <Link href="/contact" className = "hover:text-cyan-400 transition-colors" >
                                                      Careers
                                                      </Link>
                                                      </li>
                                                      < li >
                                                      <Link href="/contact" className = "hover:text-cyan-400 transition-colors" >
                                                        Contact
                                                        </Link>
                                                        </li>
                                                        </ul>
                                                        </div>
                                                        < div >
                                                        <h4 className="text-lg font-serif font-bold mb-4" > Contact Info </h4>
                                                          < div className = "space-y-2 text-gray-400 font-sans" >
                                                            <p>📧 info @pmsinvestment.com</p>
                                                              <p>📞 +91 98765 43210 </p>
                                                                <p>📍 Mumbai, Maharashtra </p>
                                                                  </div>
                                                                  </div>
                                                                  </div>
                                                                  < div className = "border-t border-gray-800 mt-12 pt-8 text-center" >
                                                                    <p className="text-gray-400 font-sans" >
              © 2024 PMS Investment Services.All rights reserved. | Privacy Policy | Terms of Service
    </p>
    </div>
    </div>
    </footer>
    </div>
  )
}
