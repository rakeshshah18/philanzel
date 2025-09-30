"use client";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Footer from "../home/footer";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useState, useEffect, useRef } from "react";
export default function EventImagesClient() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`${BASE_URL}/api/event-images`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) setImages(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchImages();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-cyan-600 text-white mb-4"> Events </Badge>
              <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
                Philanzel <span className="text-cyan-600"> Gallery </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-sans leading-relaxed">
                Explore our visual showcase of team achievements, client success stories, and key
                moments that highlight our commitment to excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/careers">
                  <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
                    Connect With Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/event-img2.jpg"
                alt="Risk assessment analysis"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
        <hr className="m-3" />
      </section>

      {/* Event Gallery */}
      <section className="py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img) => (
              <div
                key={img._id}
                className="overflow-hidden rounded-lg shadow cursor-pointer"
                onClick={() =>
                  setSelectedImage(
                    img.imageUrl.startsWith("http")
                      ? img.imageUrl
                      : `${BASE_URL}${img.imageUrl}`
                  )
                }
              >
                <img
                  src={img.imageUrl.startsWith("http") ? img.imageUrl : `${BASE_URL}${img.imageUrl}`}
                  alt={`Event ${img._id}`}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
            panning={{ disabled: false, velocityDisabled: true }}
          >
            {({ zoom, setZoom }) => (
              <TransformComponent>
                <img
                  src={selectedImage}
                  alt="Fullscreen Event"
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg
                    transition duration-300 ease-in-out
                    ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-auto"}
                  `}
                />
              </TransformComponent>
            )}
          </TransformWrapper>
        </div>
      )}
      <Footer />
    </div>
  );
}
