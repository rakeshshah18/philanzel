"use client"

import type React from "react"

import Navigation from "@/components/navigation.jsx"
import ContactSection from "./contact"
import CtaSection from "@/app/home/cta-section"
import Footer from "@/app/home/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    investmentAmount: "",
    message: "",
    preferredContact: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState<any>(null)

  // Define the backend base URL
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://philanzel-backend.onrender.com"

  // Fetch contact information from API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/contact-us/info`)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setContactInfo(data[0])
          }
        } else {
          console.error('Failed to fetch contact info')
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
      }
    }

    fetchContactInfo()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Contact form submission:", formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className= "min-h-screen bg-white" >
      <Navigation />

      < div className = "min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" >
        <div className="max-w-md w-full text-center" >
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6" >
            <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              < h2 className = "text-3xl font-serif font-black text-gray-900 mb-4" > Thank You! </h2>
                < p className = "text-gray-600 font-sans mb-8" >
                  We've received your message and will get back to you within 24 hours.
                    </p>
                    < div className = "space-y-4" >
                      <Link href="/" >
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" > Return to Homepage </Button>
                          </Link>
                          < Button
    variant = "outline"
    onClick = {() => setIsSubmitted(false)
  }
  className = "w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
    >
    Send Another Message
      </Button>
      </div>
      </div>
      </div>
      </div>
    )
}

return (
  <div className= "min-h-screen bg-white" >
  <Navigation />

{/* Hero Section */ }
<section className="bg-gradient-to-br from-gray-50 to-white py-20" >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
    <div className="text-center" >
      <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6" >
        Let's <span className="text-cyan-600">Connect</span>
          </h1>
          < p className = "text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans" >
            We’re here to guide you on your financial journey.Reach out with your questions, requests, or to schedule
              a consultation.Our expert team is always ready to help.
            </p>
  </div>
  </div>
  </section>

{/* Contact Form & Address Section */ }
<ContactSection />

{/* Contact Methods */ }
<section className="py-20 bg-white" >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" >
      <Card className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow" >
        <CardContent className="pt-8 pb-8" >
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4" >
            <Phone className="h-8 w-8 text-cyan-600" />
              </div>
              < h3 className = "text-xl font-serif font-bold text-gray-900 mb-2" > Call Us </h3>
                < p className = "text-gray-600 font-sans mb-4" > Speak directly with our financial advisors </p>
                  < a
href = {`tel:${contactInfo?.contact?.replace(/\D/g, '') || "919625116458"}`}
className = "text-cyan-600 hover:text-cyan-700 font-sans font-medium text-lg"
  >
  { contactInfo?.contact || "+91- 96 25 11 64 58"}
</a>
  < p className = "text-sm text-gray-500 font-sans mt-2" > Mon - Fri: 9:00 AM - 6:00 PM </p>
    </CardContent>
    </Card>

    < Card className = "border-0 shadow-lg text-center hover:shadow-xl transition-shadow" >
      <CardContent className="pt-8 pb-8" >
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4" >
          <Mail className="h-8 w-8 text-amber-600" />
            </div>
            < h3 className = "text-xl font-serif font-bold text-gray-900 mb-2" > Email Us </h3>
              < p className = "text-gray-600 font-sans mb-4" > Send us your questions anytime </p>
                < a
href = {`mailto:${contactInfo?.email || "coach@philanzel.com"}`}
className = "text-cyan-600 hover:text-cyan-700 font-sans font-medium"
  >
  { contactInfo?.email || "coach@philanzel.com"}
</a>
  < p className = "text-sm text-gray-500 font-sans mt-2" > We respond within 24 hours </p>
    </CardContent>
    </Card>

    < Card className = "border-0 shadow-lg text-center hover:shadow-xl transition-shadow" >
      <CardContent className="pt-8 pb-8" >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" >
          <MapPin className="h-8 w-8 text-green-600" />
            </div>
            < h3 className = "text-xl font-serif font-bold text-gray-900 mb-2" > Visit Us </h3>
              < p className = "text-gray-600 font-sans mb-4" > Come to our office for consultation </p>
                < div className = "text-cyan-600 font-sans font-medium text-center leading-relaxed" >
                { contactInfo?.address || "Unit no. 223, Vardhman Sunrise Plaza, Vasundhara Enclave, New Delhi-110096"}
</div>

  </CardContent>
  </Card>
  </div>
  </div>
  </section>



{/* CTA Section */ }
<CtaSection />

{/* Footer */ }
<Footer />
  </div>
  )
}
