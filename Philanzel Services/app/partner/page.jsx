"use client"

import Navigation from "@/components/navigation.jsx"
import PartnerAbout from "./about"
import AssociationSection from "./association"
import OurProcessSection from "./ourProcess"
import EmpowerSection from "./empower"
import PotentialGrowthSection from "./potentialGrowth"
import WhyChooseUsSection from "./whyChooseUs"
import TestimonialsSection from "../home/testimonials"
import AdsSection from "../home/ads-section"
import FAQsSection from "./faqs"
import CTASection from "../home/cta-section"
import Footer from "../home/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Handshake, TrendingUp, Users, Globe, Send, MessageSquare, Star, ArrowRight, CheckCircle, Building, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PartnerPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        partnershipType: "",
        experience: "",
        message: "",
        website: "",
    })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />

                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full text-center">
                        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-gray-900 mb-4">Application Submitted!</h2>
                        <p className="text-gray-600 font-sans mb-8">
                            Thank you for your interest in partnering with us. Our partnership team will review your application and contact you within 3-5 business days.
                        </p>
                        <div className="space-y-4">
                            <Link href="/">
                                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">Return to Homepage</Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                            >
                                Submit Another Application
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <section className="bg-gradient-to-br from-gray-50 to-white py-5">
                <PartnerAbout />
            </section>
            <AssociationSection />
            <OurProcessSection />
            <EmpowerSection />
            <PotentialGrowthSection />
            <WhyChooseUsSection />
            <TestimonialsSection />
            <AdsSection />
            <FAQsSection />
            <CTASection />
            <Footer />

        </div>
    )
}