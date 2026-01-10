"use client";
import React, { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const OurAssociation = () => {
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([[], [], []]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${BASE_URL}/api/our-association`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setData(json.data[0]);
          setRows([
            json.data[0].rowOne || [],
            json.data[0].rowTwo || [],
            json.data[0].rowThree || []
          ]);
        }
      } catch (e) {
      }
    }
    fetchData();
  }, []);

  if (!data) return null;
  const logoRows = rows;
  return (
    <section className="py-20 bg-[#f7f7fb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.heading || "Our Associations"}
            </h2>
            <div
              className="text-gray-600 mb-8"
              dangerouslySetInnerHTML={{ __html: data.description || "that's what you get when you choose Philanzel" }}
            />
            <button className="bg-gray-800 text-white font-semibold rounded-full px-8 py-3 shadow hover:bg-cyan-700 transition-colors duration-300">
              View All
            </button>
          </div>
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
              {logoRows.map((row, i) => (
                <div className="overflow-hidden" key={i}>
                  <div
                    className={`flex gap-8 min-w-max ${i % 2 === 1 ? "animate-scroll-right" : "animate-scroll-left"}`}
                    style={{ animation: `${i % 2 === 1 ? "scroll-right" : "scroll-left"} ${18 + i * 2}s linear infinite` }}
                  >
                    {row.concat(row).map((logo, idx) => {
                      let imgUrl = logo?.url || '';
                      if (imgUrl && !imgUrl.startsWith('http') && !imgUrl.startsWith('//')) {
                        imgUrl = `${BASE_URL}${imgUrl}`;
                      }
                      return imgUrl ? (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={logo.alt || `Association Logo ${idx}`}
                          className="h-12 object-contain bg-white rounded shadow p-2"
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurAssociation;
