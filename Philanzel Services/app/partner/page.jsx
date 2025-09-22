"use client"

import Navigation from "@/components/navigation"
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
        // Handle form submission logic here
        console.log("Partnership application submission:", formData)
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

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
                            Become a <span className="text-cyan-600">Partner</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
                            Join our network of trusted financial professionals and grow your business with Philanzel Services. Together, we can provide exceptional value to clients.
                        </p>
                    </div>
                </div>
            </section>

            {/* Partnership Benefits */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-cyan-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Grow Your Business</h3>
                                <p className="text-gray-600 font-sans mb-4">Access our resources and expand your client base with our proven strategies</p>
                                <p className="text-cyan-600 hover:text-cyan-700 font-sans font-medium text-lg">
                                    Revenue Growth
                                </p>
                                <p className="text-sm text-gray-500 font-sans mt-2">Scalable Partnership</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Handshake className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Trusted Network</h3>
                                <p className="text-gray-600 font-sans mb-4">Join a community of successful financial professionals and advisors</p>
                                <p className="text-cyan-600 hover:text-cyan-700 font-sans font-medium">
                                    Professional Network
                                </p>
                                <p className="text-sm text-gray-500 font-sans mt-2">Industry Connections</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
                            <CardContent className="pt-8 pb-8">
                                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="h-8 w-8 text-cyan-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Premium Support</h3>
                                <p className="text-gray-600 font-sans mb-4">Get dedicated support, training, and marketing resources</p>
                                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                                    Learn More
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Partnership Application Form and Partnership Types */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Partnership Application Form */}
                        <div>
                            <Card className="border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif font-bold text-gray-900 flex items-center">
                                        <MessageSquare className="h-6 w-6 text-cyan-600 mr-3" />
                                        Partnership Application
                                    </CardTitle>
                                    <p className="text-gray-600 font-sans">
                                        Fill out the form below to start your partnership journey with us.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 font-sans">
                                                    First Name *
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    type="text"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="Your first name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 font-sans">
                                                    Last Name *
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    type="text"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="Your last name"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-sans">
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 font-sans">
                                                    Phone Number *
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="+91 12345 67890"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="company" className="text-sm font-medium text-gray-700 font-sans">
                                                    Company/Organization *
                                                </Label>
                                                <Input
                                                    id="company"
                                                    type="text"
                                                    required
                                                    value={formData.company}
                                                    onChange={(e) => handleInputChange("company", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="Your company name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website" className="text-sm font-medium text-gray-700 font-sans">
                                                    Website (Optional)
                                                </Label>
                                                <Input
                                                    id="website"
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={(e) => handleInputChange("website", e.target.value)}
                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                                                    placeholder="https://www.yourcompany.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="partnershipType" className="text-sm font-medium text-gray-700 font-sans">
                                                    Partnership Type *
                                                </Label>
                                                <Select value={formData.partnershipType} onValueChange={(value) => handleInputChange("partnershipType", value)}>
                                                    <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans">
                                                        <SelectValue placeholder="Select partnership type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="referral-partner">Referral Partner</SelectItem>
                                                        <SelectItem value="strategic-partner">Strategic Partner</SelectItem>
                                                        <SelectItem value="technology-partner">Technology Partner</SelectItem>
                                                        <SelectItem value="channel-partner">Channel Partner</SelectItem>
                                                        <SelectItem value="affiliate-partner">Affiliate Partner</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="experience" className="text-sm font-medium text-gray-700 font-sans">
                                                    Industry Experience
                                                </Label>
                                                <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                                                    <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans">
                                                        <SelectValue placeholder="Select experience level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0-2">0-2 years</SelectItem>
                                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                                        <SelectItem value="6-10">6-10 years</SelectItem>
                                                        <SelectItem value="10+">10+ years</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-sm font-medium text-gray-700 font-sans">
                                                Partnership Proposal / Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans resize-none"
                                                placeholder="Tell us about your partnership goals and how we can work together..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-colors font-sans"
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit Partnership Application
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Partnership Types and Benefits */}
                        <div>
                            <Card className="border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-serif font-bold text-gray-900 flex items-center">
                                        <Handshake className="h-6 w-6 text-cyan-600 mr-3" />
                                        Partnership Opportunities
                                    </CardTitle>
                                    <p className="text-gray-600 font-sans">
                                        Explore different ways to partner with us and grow together.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Partnership Type 1 */}
                                    <div className="border-l-4 border-cyan-600 pl-4 py-3 bg-cyan-50 rounded-r-lg">
                                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Referral Partner</h4>
                                        <p className="text-sm text-gray-600 font-sans mb-2">Commission-based • No upfront investment</p>
                                        <p className="text-gray-700 font-sans text-sm mb-3">
                                            Refer clients to our services and earn attractive commissions on successful conversions.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Commission-based</span>
                                            <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Easy Setup</span>
                                            <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Marketing Support</span>
                                        </div>
                                    </div>

                                    {/* Partnership Type 2 */}
                                    <div className="border-l-4 border-amber-600 pl-4 py-3 bg-amber-50 rounded-r-lg">
                                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Strategic Partner</h4>
                                        <p className="text-sm text-gray-600 font-sans mb-2">Long-term • Mutual growth opportunities</p>
                                        <p className="text-gray-700 font-sans text-sm mb-3">
                                            Collaborate on joint ventures, co-branded services, and shared market expansion strategies.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Joint Ventures</span>
                                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Co-branding</span>
                                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Market Expansion</span>
                                        </div>
                                    </div>

                                    {/* Partnership Type 3 */}
                                    <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50 rounded-r-lg">
                                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Technology Partner</h4>
                                        <p className="text-sm text-gray-600 font-sans mb-2">Integration-focused • Innovation-driven</p>
                                        <p className="text-gray-700 font-sans text-sm mb-3">
                                            Integrate your technology solutions with our platform to enhance client experience and service delivery.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">API Integration</span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">Innovation</span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">Tech Support</span>
                                        </div>
                                    </div>

                                    {/* Partnership Type 4 */}
                                    <div className="border-l-4 border-purple-600 pl-4 py-3 bg-purple-50 rounded-r-lg">
                                        <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Channel Partner</h4>
                                        <p className="text-sm text-gray-600 font-sans mb-2">Reseller program • Revenue sharing</p>
                                        <p className="text-gray-700 font-sans text-sm mb-3">
                                            Become an authorized reseller of our services with exclusive territories and competitive margins.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">Reseller Program</span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">Territory Rights</span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">Training</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 font-sans text-center">
                                            Looking for a custom partnership model?{" "}
                                            <span className="text-cyan-600 font-medium">Let's discuss your unique requirements!</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partnership Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Why Partner With Philanzel?</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                            Join forces with a trusted leader in financial services and unlock new opportunities for growth and success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="h-8 w-8 text-cyan-600" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Attractive Returns</h3>
                            <p className="text-gray-600 font-sans text-sm">
                                Competitive commission structures and revenue sharing models that reward performance.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Dedicated Support</h3>
                            <p className="text-gray-600 font-sans text-sm">
                                Personal relationship managers and comprehensive training programs for your success.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Market Reach</h3>
                            <p className="text-gray-600 font-sans text-sm">
                                Access to our extensive client base and proven marketing strategies for faster growth.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Brand Association</h3>
                            <p className="text-gray-600 font-sans text-sm">
                                Leverage our established brand reputation and industry credibility for your business.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-cyan-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Partner With Us?</h2>
                    <p className="text-xl text-cyan-100 mb-8 font-sans">
                        Take the first step towards a profitable partnership and mutual growth.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => document.getElementById('firstName')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3"
                        >
                            Apply Now
                        </Button>
                        <Link href="/contact">
                            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3">
                                Contact Partnership Team
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}