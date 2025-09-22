
"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Briefcase, Mail, Clock, Send, MessageSquare, Calendar, ArrowRight, CheckCircle, Building } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CareersPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, resume: file }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Career application submission:", formData)
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
              Thank you for your interest in joining our team. We'll review your application and get back to you within 5-7 business days.
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
              Join Our <span className="text-cyan-600">Team</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Be part of a dynamic team that's shaping the future of financial services. Discover exciting career opportunities and grow with us.
            </p>
          </div>
        </div>
      </section>

      {/* Career Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Great Team</h3>
                <p className="text-gray-600 font-sans mb-4">Work with talented professionals in a collaborative environment</p>
                <p className="text-cyan-600 hover:text-cyan-700 font-sans font-medium text-lg">
                  Team-First Culture
                </p>
                <p className="text-sm text-gray-500 font-sans mt-2">Supportive & Inclusive</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Growth Opportunities</h3>
                <p className="text-gray-600 font-sans mb-4">Advance your career with continuous learning and development</p>
                <p className="text-cyan-600 hover:text-cyan-700 font-sans font-medium">
                  Professional Development
                </p>
                <p className="text-sm text-gray-500 font-sans mt-2">Training & Mentorship</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Great Benefits</h3>
                <p className="text-gray-600 font-sans mb-4">Comprehensive benefits package and work-life balance</p>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  View Benefits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form and Job Openings */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Application Form */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif font-bold text-gray-900 flex items-center">
                    <MessageSquare className="h-6 w-6 text-cyan-600 mr-3" />
                    Apply Now
                  </CardTitle>
                  <p className="text-gray-600 font-sans">
                    Submit your application and join our growing team of professionals.
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
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                          placeholder="+91 12345 67890"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-sm font-medium text-gray-700 font-sans">
                          Position of Interest *
                        </Label>
                        <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                          <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans">
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="financial-advisor">Financial Advisor</SelectItem>
                            <SelectItem value="investment-analyst">Investment Analyst</SelectItem>
                            <SelectItem value="client-relations">Client Relations Manager</SelectItem>
                            <SelectItem value="marketing">Marketing Specialist</SelectItem>
                            <SelectItem value="operations">Operations Manager</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium text-gray-700 font-sans">
                          Years of Experience
                        </Label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                          <SelectTrigger className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-3">2-3 years</SelectItem>
                            <SelectItem value="4-6">4-6 years</SelectItem>
                            <SelectItem value="7-10">7-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-sm font-medium text-gray-700 font-sans">
                        Upload Resume *
                      </Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        required
                        onChange={handleFileChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                      />
                      <p className="text-xs text-gray-500 font-sans">
                        Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700 font-sans">
                        Cover Letter / Additional Information
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 font-sans resize-none"
                        placeholder="Tell us why you'd like to join our team..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg font-medium transition-colors font-sans"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Current Job Openings */}
            <div>
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif font-bold text-gray-900 flex items-center">
                    <Briefcase className="h-6 w-6 text-cyan-600 mr-3" />
                    Current Openings
                  </CardTitle>
                  <p className="text-gray-600 font-sans">
                    Explore our available positions and find your perfect fit.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Listing 1 */}
                  <div className="border-l-4 border-cyan-600 pl-4 py-3 bg-cyan-50 rounded-r-lg">
                    <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Financial Advisor</h4>
                    <p className="text-sm text-gray-600 font-sans mb-2">Full-time • Mumbai • 2-5 years experience</p>
                    <p className="text-gray-700 font-sans text-sm mb-3">
                      Help clients achieve their financial goals through personalized investment strategies and portfolio management.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Investment Planning</span>
                      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Client Relations</span>
                      <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-sans">Financial Analysis</span>
                    </div>
                  </div>

                  {/* Job Listing 2 */}
                  <div className="border-l-4 border-amber-600 pl-4 py-3 bg-amber-50 rounded-r-lg">
                    <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Investment Analyst</h4>
                    <p className="text-sm text-gray-600 font-sans mb-2">Full-time • Delhi • 1-3 years experience</p>
                    <p className="text-gray-700 font-sans text-sm mb-3">
                      Research and analyze investment opportunities, market trends, and prepare detailed reports for portfolio management.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Market Research</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Financial Modeling</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-sans">Data Analysis</span>
                    </div>
                  </div>

                  {/* Job Listing 3 */}
                  <div className="border-l-4 border-green-600 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Client Relations Manager</h4>
                    <p className="text-sm text-gray-600 font-sans mb-2">Full-time • Bangalore • 3-6 years experience</p>
                    <p className="text-gray-700 font-sans text-sm mb-3">
                      Manage client relationships, ensure exceptional service delivery, and identify opportunities for account growth.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">Relationship Management</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">Communication</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sans">Business Development</span>
                    </div>
                  </div>

                  {/* Job Listing 4 */}
                  <div className="border-l-4 border-purple-600 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">Marketing Specialist</h4>
                    <p className="text-sm text-gray-600 font-sans mb-2">Full-time • Remote • 2-4 years experience</p>
                    <p className="text-gray-700 font-sans text-sm mb-3">
                      Drive marketing initiatives, create compelling content, and help expand our digital presence in the financial services sector.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">Digital Marketing</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">Content Creation</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-sans">SEO/SEM</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 font-sans text-center">
                      Don't see a perfect match? We're always looking for talented individuals.{" "}
                      <span className="text-cyan-600 font-medium">Submit your application anyway!</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Why Choose Philanzel?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
              Join a company that values growth, innovation, and making a positive impact in the financial services industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Collaborative Culture</h3>
              <p className="text-gray-600 font-sans text-sm">
                Work in a supportive environment where teamwork and knowledge sharing are valued.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600 font-sans text-sm">
                Clear advancement paths and opportunities to develop your skills and expertise.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Modern Workplace</h3>
              <p className="text-gray-600 font-sans text-sm">
                State-of-the-art facilities and flexible work arrangements to ensure work-life balance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Comprehensive Benefits</h3>
              <p className="text-gray-600 font-sans text-sm">
                Health insurance, retirement plans, professional development budget, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-cyan-100 mb-8 font-sans">
            Take the next step in your career and join our team of financial professionals.
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
                Contact HR
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}