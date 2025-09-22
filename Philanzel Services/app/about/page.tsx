import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Award, Shield, Target } from "lucide-react"
import Link from "next/link"
import Footer from "@/app/home/footer"
import CtaSection from "@/app/home/cta-section"
import AdsSection from "@/app/home/ads-section"
import { OurStory } from "./comp/ourStory.jsx"
import { OurHistory } from "./comp/ourHistory.jsx"
import { OurApproach } from "./comp/approach.jsx"
import { OurFounder } from "./comp/ourFounder.jsx"
import Testimonials from "@/app/home/testimonials"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
              About <span className="text-cyan-600">Philanzel</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Our story began with a vision to empower individuals to take control of their financial lives. We saw people struggling to make
              sense of the complex financial landscape, and we knew we could make a difference.
            </p>
          </div>
        </div>
      </section>

      <OurStory />
      <OurHistory />
      <OurApproach />
      <OurFounder />
      <Testimonials />
      <AdsSection />
      <CtaSection />
      <Footer />
    </div>
  )
}