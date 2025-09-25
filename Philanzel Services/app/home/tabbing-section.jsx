"use client";
import React, { useState, useEffect } from "react";
import "./tabbing-css.css"; // your custom CSS file

// Define the backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const ServicesTabsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [common, setCommon] = useState({
    heading: "OUR SERVICES",
    description: "",
    image: "",
    button: { text: "", link: "" },
  });

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    async function fetchTabs() {
      try {
        // Fetch tabbing services (tabs) and settings in parallel
        const [servicesRes, settingsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/services/public`),
          fetch(`${BASE_URL}/api/tabbing-services/settings`),
        ]);

        const servicesJson = await servicesRes.json();
        console.log("SERVICES DATA:", servicesJson.data);
        const settingsJson = await settingsRes.json();

        // Set common section from settings
        if (settingsJson.success && settingsJson.data) {
          setCommon({
            heading: settingsJson.data.commonHeading || "OUR SERVICES",
            description: settingsJson.data.commonImageDescription || "",
            image: settingsJson.data.commonBackgroundImage?.url || "",
            button: settingsJson.data.commonImageButton || { text: "", link: "" },
          });
        }

        // Set tabs from services
        const servicesArr = Array.isArray(servicesJson?.data)
          ? servicesJson.data
          : [];

        setTabs(
          servicesArr.map((service) => ({
            label: service.tabTitle || service.label || service.title || "",
            heading: service.contentTitle || service.heading || service.title || "",
            description: service.description || "",
            image: service.icon || service.image || "",
            button: {
              text: service.buttonText || service.button?.text || "Learn More",
              link: service.buttonLink || service.button?.link || "#",
            },
          }))
        );
      } catch (e) {
        console.error("Error fetching tabs:", e);
      }
    }

    fetchTabs();
  }, []);

  const handleTabClick = (index) => setActiveTab(index);
  const activeService = tabs.length > 0 ? tabs[activeTab] : null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-xs font-semibold tracking-widest text-cyan-700 bg-cyan-50 px-4 py-1 rounded">
              {common.heading}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">What We Offer</h2>
          <div
            className="text-gray-600 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: common.description }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side tabs */}
          <div className="flex-1 min-w-0">
            <div
              role="tablist"
              className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.label || index}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === index
                      ? "border-cyan-600 text-cyan-700"
                      : "border-transparent text-gray-700 hover:text-cyan-600"
                  }`}
                  onClick={() => handleTabClick(index)}
                  type="button"
                  aria-selected={activeTab === index}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeService && (
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {activeService.image && (
                  <img
                    src={
                      activeService.image.startsWith("http")
                        ? activeService.image
                        : `${BASE_URL}${activeService.image}`
                    }
                    alt={`${activeService.label || ""} service`}
                    className="w-48 h-48 object-cover rounded-lg shadow"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {activeService.heading}
                  </h3>
                  <div
                    className="text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{ __html: activeService.description }}
                  />
                  {activeService.button && (
                    <a
                      href={activeService.button.link}
                      className="text-cyan-700 font-semibold hover:underline text-sm transition-all duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {activeService.button.text} →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side common card */}
          <div className="w-full md:w-80 flex-shrink-0 self-start">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              {common.image && (
                <img
                  src={
                    common.image.startsWith("http")
                      ? common.image
                      : `${BASE_URL}${common.image}`
                  }
                  alt="Common Service"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end items-center p-6">
                <div className="mb-3 text-white text-center text-base font-semibold leading-tight">
                  <div>Get Your Finances</div>
                  <div>Reviewed by Our Experts</div>
                </div>
                {common.button && (
                  <a
                    href={common.button.link}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded shadow transition-colors duration-200 w-max"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {common.button.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesTabsSection;
